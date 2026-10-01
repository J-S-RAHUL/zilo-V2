import express from 'express';
import { INITIAL_WORKERS } from '../data/seedData.js';
import Worker from '../models/Worker.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();
let memoryWorkers = [...INITIAL_WORKERS];

// GET /api/workers - List workers with optional filtering
router.get('/', async (req, res) => {
  const { category, search, availability, minExp, maxWage, city } = req.query;

  try {
    if (isDbConnected()) {
      const query = {};

      if (category && category !== 'All') {
        query.$or = [
          { primarySkill: new RegExp(`^${category}$`, 'i') },
          { skills: new RegExp(category, 'i') }
        ];
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = query.$or || [];
        query.$or.push(
          { name: searchRegex },
          { primarySkill: searchRegex },
          { skills: searchRegex },
          { location: searchRegex },
          { city: searchRegex }
        );
      }

      if (availability === 'available_now' || availability === 'today') {
        query.isAvailable = true;
      }

      if (minExp) {
        query.experienceYears = { $gte: Number(minExp) };
      }

      if (maxWage) {
        query.dailyWage = { $lte: Number(maxWage) };
      }

      if (city) {
        query.city = new RegExp(`^${city}$`, 'i');
      }

      if (req.query.profileCategory === 'extra_hands') {
        query.profileCategory = 'extra_hands';
        query.isOnlineToWork = true;
      }

      const workers = await Worker.find(query).sort({ rating: -1, createdAt: -1 }).lean();
      return res.json({
        success: true,
        source: 'database',
        total: workers.length,
        data: workers
      });
    }

    // In-memory fallback
    let results = [...memoryWorkers];

    if (category && category !== 'All') {
      results = results.filter(w => 
        w.primarySkill.toLowerCase() === category.toLowerCase() ||
        w.skills.some(s => s.toLowerCase().includes(category.toLowerCase()))
      );
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(w => 
        w.name.toLowerCase().includes(q) ||
        w.primarySkill.toLowerCase().includes(q) ||
        w.skills.some(s => s.toLowerCase().includes(q)) ||
        w.location.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q)
      );
    }

    if (availability === 'available_now' || availability === 'today') {
      results = results.filter(w => w.isAvailable);
    }

    if (minExp) {
      results = results.filter(w => w.experienceYears >= Number(minExp));
    }

    if (maxWage) {
      results = results.filter(w => w.dailyWage <= Number(maxWage));
    }

    if (city) {
      results = results.filter(w => w.city.toLowerCase() === city.toLowerCase());
    }

    if (req.query.profileCategory === 'extra_hands') {
      results = results.filter(w => w.profileCategory === 'extra_hands' && w.isOnlineToWork === true);
    }

    res.json({
      success: true,
      source: 'memory',
      total: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/workers/:id - Single worker details
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const worker = await Worker.findOne({ id: req.params.id }).lean();
      if (!worker) {
        return res.status(404).json({ success: false, message: 'Worker not found' });
      }
      return res.json({ success: true, source: 'database', data: worker });
    }

    const worker = memoryWorkers.find(w => w.id === req.params.id);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }
    res.json({ success: true, source: 'memory', data: worker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/workers - Create new worker profile
router.post('/', async (req, res) => {
  try {
    const newWorkerData = {
      id: `worker-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      distanceKm: 2.0,
      isAvailable: true,
      availabilityText: 'Available Today',
      ...req.body
    };

    // STRICT RULE: Only one profile can keep one profile in Extra Hands
    if (newWorkerData.profileCategory === 'extra_hands') {
      const matchIdx = memoryWorkers.findIndex(
        (w) =>
          w.profileCategory === 'extra_hands' &&
          ((newWorkerData.userId && w.userId === newWorkerData.userId) ||
           (newWorkerData.mobile && (w.mobile === newWorkerData.mobile || w.phone === newWorkerData.mobile)) ||
           (newWorkerData.phone && (w.mobile === newWorkerData.phone || w.phone === newWorkerData.phone)))
      );
      if (matchIdx >= 0) {
        memoryWorkers[matchIdx] = { ...memoryWorkers[matchIdx], ...newWorkerData };
        if (isDbConnected()) {
          const updated = await Worker.findOneAndUpdate(
            {
              profileCategory: 'extra_hands',
              $or: [
                { userId: newWorkerData.userId },
                { phone: newWorkerData.mobile || newWorkerData.phone }
              ]
            },
            newWorkerData,
            { new: true }
          );
          return res.status(200).json({
            success: true,
            message: 'Updated existing Extra Hands profile (Only 1 profile permitted per user)',
            data: updated
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Updated existing Extra Hands profile (Only 1 profile permitted per user)',
          data: memoryWorkers[matchIdx]
        });
      }
    }

    memoryWorkers.unshift(newWorkerData);

    if (isDbConnected()) {
      const createdWorker = await Worker.create(newWorkerData);
      return res.status(201).json({ success: true, source: 'database', data: createdWorker });
    }

    res.status(201).json({ success: true, source: 'memory', data: newWorkerData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/workers/:id/availability - Toggle live availability
router.patch('/:id/availability', async (req, res) => {
  try {
    const memoryWorker = memoryWorkers.find(w => w.id === req.params.id);
    const newStatus = typeof req.body.isAvailable === 'boolean' 
      ? req.body.isAvailable 
      : (memoryWorker ? !memoryWorker.isAvailable : true);
    const newAvailabilityText = newStatus ? 'Available Today' : 'Currently Busy';

    if (memoryWorker) {
      memoryWorker.isAvailable = newStatus;
      memoryWorker.availabilityText = newAvailabilityText;
    }

    if (isDbConnected()) {
      const updated = await Worker.findOneAndUpdate(
        { id: req.params.id },
        { isAvailable: newStatus, availabilityText: newAvailabilityText },
        { new: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Worker not found' });
      }
      return res.json({ success: true, source: 'database', data: updated });
    }

    if (!memoryWorker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    res.json({ success: true, source: 'memory', data: memoryWorker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/workers/:id - Remove worker profile (e.g. from Extra Hands)
router.delete('/:id', async (req, res) => {
  try {
    const index = memoryWorkers.findIndex(w => w.id === req.params.id);
    if (index >= 0) {
      memoryWorkers.splice(index, 1);
    }
    if (isDbConnected()) {
      await Worker.findOneAndDelete({ id: req.params.id });
    }
    res.json({ success: true, message: 'Worker profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
