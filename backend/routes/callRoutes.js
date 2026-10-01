import express from 'express';
import { INITIAL_CALL_HISTORY } from '../data/seedData.js';
import CallLog from '../models/CallLog.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();
let memoryCalls = [...INITIAL_CALL_HISTORY];

// GET /api/calls - Fetch call history
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const calls = await CallLog.find().sort({ timestamp: -1 }).limit(100).lean();
      return res.json({
        success: true,
        source: 'database',
        total: calls.length,
        data: calls
      });
    }

    res.json({
      success: true,
      source: 'memory',
      total: memoryCalls.length,
      data: memoryCalls
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/calls - Log a direct phone call
router.post('/', async (req, res) => {
  const { callerRole, callerName, targetId, targetName, targetRole, targetSkillOrTitle, phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  const newLogData = {
    id: `call-${Date.now()}`,
    callerRole: callerRole || 'employer',
    callerName: callerName || 'Anonymous',
    targetId: targetId || '',
    targetName: targetName || 'Direct Contact',
    targetRole: targetRole || 'worker',
    targetSkillOrTitle: targetSkillOrTitle || '',
    phone,
    timestamp: new Date()
  };

  try {
    memoryCalls.unshift(newLogData);

    if (isDbConnected()) {
      const created = await CallLog.create(newLogData);
      return res.status(201).json({ success: true, source: 'database', data: created });
    }

    res.status(201).json({ success: true, source: 'memory', data: newLogData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/calls - Clear call history
router.delete('/', async (req, res) => {
  try {
    memoryCalls = [];

    if (isDbConnected()) {
      await CallLog.deleteMany({});
      return res.json({ success: true, source: 'database', message: 'Call history cleared' });
    }

    res.json({ success: true, source: 'memory', message: 'Call history cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
