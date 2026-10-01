import dns from 'dns';
import mongoose from 'mongoose';
import { INITIAL_CATEGORIES } from '../data/seedData.js';
import Category from '../models/Category.js';

// Resolve MongoDB Atlas SRV records using public DNS to prevent ISP ECONNREFUSED errors
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // Ignore in environments where setServers is restricted
}

let dbConnected = false;

export const isDbConnected = () => dbConnected;

export const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('⚠️  MONGODB_URI not found in environment.');
    console.log('💡 Running with In-Memory fallback mode. To connect persistent cloud DB:');
    console.log('   Add your MongoDB Atlas URI in backend/.env: MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/zilo');
    return false;
  }

  // Automatically remove placeholder brackets < > if present in credentials
  uri = uri.replace(/:(<)([^>]+)(>)/, ':$2');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    dbConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed trade categories only if empty
    await autoSeedCategories();
    return true;
  } catch (error) {
    dbConnected = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    if (error.message.includes('SSL alert number 80') || error.message.includes('tlsv1 alert') || error.message.includes('Could not connect to any servers')) {
      console.log('\n🔒 MONGODB ATLAS IP ACCESS LIST (FIREWALL) ERROR:');
      console.log('👉 Why this happens: Your current IP address is not whitelisted in MongoDB Atlas.');
      console.log('👉 Quick 1-minute Fix:');
      console.log('   1. Open https://cloud.mongodb.com and log in');
      console.log('   2. In the left menu under Security, click "Network Access"');
      console.log('   3. Click the "+ Add IP Address" green button');
      console.log('   4. Click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) and click Confirm');
      console.log('   5. Wait ~30 seconds for it to become Active, then restart the server.\n');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n🔑 MONGODB CREDENTIALS ERROR:');
      console.log('👉 The database username or password in MONGODB_URI is incorrect.');
      console.log('   Go to MongoDB Atlas -> Database Access -> edit your user password and update backend/.env\n');
    } else if (error.message.includes('querySrv ECONNREFUSED')) {
      console.log('\n🌐 DNS RESOLUTION ERROR:');
      console.log('👉 Your local internet service provider (ISP) is blocking DNS SRV records.');
      console.log('   Using Google DNS (8.8.8.8) fallback.\n');
    }

    console.log('⚠️  Operating in resilient in-memory mode (clean 0 demo data) until database is reachable.');
    return false;
  }
};

const autoSeedCategories = async () => {
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Initializing basic Trade Categories in MongoDB...');
      await Category.insertMany(INITIAL_CATEGORIES);
    }
  } catch (err) {
    console.error('⚠️ Category init note:', err.message);
  }
};
