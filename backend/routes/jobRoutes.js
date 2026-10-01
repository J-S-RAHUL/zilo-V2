import express from 'express';
import { INITIAL_JOBS } from '../data/seedData.js';
import Job from '../models/Job.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();
let memoryJobs = [...INITIAL_JOBS];

// GET /api/jobs - List job postings with optional filters
router.get('/', async (req, res) => {
  const { category, search, city, status } = req.query;

  try {
    if (isDbConnected()) {
      const query = {};

      if (category && category !== 'All') {
        query.category = new RegExp(`^${category}$`, 'i');
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { title: searchRegex },
          { category: searchRegex },
          { location: searchRegex },
          { city: searchRegex },
          { description: searchRegex }
        ];
      }

      if (city) {
        query.city = new RegExp(`^${city}$`, 'i');
      }

      if (status) {
        query.status = status;
      }

      const jobs = await Job.find(query).sort({ createdAt: -1 }).lean();
      return res.json({
        success: true,
        source: 'database',
        total: jobs.length,
        data: jobs
      });
    }

    // In-memory fallback
    let results = [...memoryJobs];

    if (category && category !== 'All') {
      results = results.filter(j => j.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.city.toLowerCase().includes(q) ||
        (j.description && j.description.toLowerCase().includes(q))
      );
    }

    if (city) {
      results = results.filter(j => j.city.toLowerCase() === city.toLowerCase());
    }

    if (status) {
      results = results.filter(j => j.status === status);
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

// GET /api/jobs/:id - Single job details
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const job = await Job.findOne({ id: req.params.id }).lean();
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      return res.json({ success: true, source: 'database', data: job });
    }

    const job = memoryJobs.find(j => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, source: 'memory', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/jobs - Post a new job requirement
router.post('/', async (req, res) => {
  try {
    const newJobData = {
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      ...req.body
    };

    memoryJobs.unshift(newJobData);

    if (isDbConnected()) {
      const createdJob = await Job.create(newJobData);
      return res.status(201).json({ success: true, source: 'database', data: createdJob });
    }

    res.status(201).json({ success: true, source: 'memory', data: newJobData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/jobs/:id/status - Update job status (active/closed)
router.patch('/:id/status', async (req, res) => {
  try {
    const memoryJob = memoryJobs.find(j => j.id === req.params.id);
    const newStatus = req.body.status || (memoryJob && memoryJob.status === 'active' ? 'closed' : 'active');

    if (memoryJob) {
      memoryJob.status = newStatus;
    }

    if (isDbConnected()) {
      const updated = await Job.findOneAndUpdate(
        { id: req.params.id },
        { status: newStatus },
        { new: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      return res.json({ success: true, source: 'database', data: updated });
    }

    if (!memoryJob) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, source: 'memory', data: memoryJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
