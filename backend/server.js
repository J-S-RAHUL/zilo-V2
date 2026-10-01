import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db.js';
import { INITIAL_CATEGORIES } from './data/seedData.js';
import Category from './models/Category.js';
import Worker from './models/Worker.js';
import Job from './models/Job.js';
import CallLog from './models/CallLog.js';
import workerRoutes from './routes/workerRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import callRoutes from './routes/callRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/workers', workerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/calls', callRoutes);

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    if (isDbConnected()) {
      const categories = await Category.find().lean();
      return res.json({
        success: true,
        source: 'database',
        total: categories.length,
        data: categories
      });
    }

    res.json({
      success: true,
      source: 'memory',
      total: INITIAL_CATEGORIES.length,
      data: INITIAL_CATEGORIES
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Platform Stats
app.get('/api/stats', async (req, res) => {
  try {
    if (isDbConnected()) {
      const [workerCount, jobCount, callCount] = await Promise.all([
        Worker.countDocuments(),
        Job.countDocuments(),
        CallLog.countDocuments()
      ]);

      return res.json({
        success: true,
        source: 'database',
        data: {
          activeWorkers: workerCount,
          activeJobs: jobCount,
          callsInitiated: callCount,
          avgResponseMinutes: 3,
          citiesCovered: 12
        }
      });
    }

    res.json({
      success: true,
      source: 'memory',
      data: {
        activeWorkers: 0,
        activeJobs: 0,
        callsInitiated: 0,
        avgResponseMinutes: 3,
        citiesCovered: 12
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Health check with DB status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Zilo Backend API',
    database: isDbConnected() ? 'connected (MongoDB)' : 'in-memory fallback (active)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 40px; max-width: 600px; margin: auto;">
      <h1 style="color: #ff5722;">Zilo Backend API</h1>
      <p>Direct worker-to-employer connection platform backend.</p>
      <p><strong>Database Status:</strong> ${isDbConnected() ? '🟢 Connected (MongoDB)' : '🟡 In-Memory Mode'}</p>
      <ul>
        <li><a href="/api/health">/api/health</a> - Health check & DB status</li>
        <li><a href="/api/categories">/api/categories</a> - Trade categories</li>
        <li><a href="/api/workers">/api/workers</a> - Workers list</li>
        <li><a href="/api/jobs">/api/jobs</a> - Job listings</li>
        <li><a href="/api/calls">/api/calls</a> - Call history logs</li>
        <li><a href="/api/stats">/api/stats</a> - Platform statistics</li>
      </ul>
    </div>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Zilo Backend Server running on http://localhost:${PORT}`);
});
