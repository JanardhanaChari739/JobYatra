const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let mongod = null;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobyatra';

  try {
    // Attempt standard connection first with a 2-second timeout
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[JobYatra DB] Connected to MongoDB at ${mongoURI}`);
    return;
  } catch (err) {
    console.warn(`[JobYatra DB] Could not connect to primary MongoDB (${mongoURI}): ${err.message}`);
    console.log('[JobYatra DB] Initializing MongoMemoryServer fallback for seamless local execution...');

    try {
      const cacheDir = path.resolve(__dirname, '../../.cache/mongodb-bin');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      process.env.MONGOMS_DOWNLOAD_DIR = cacheDir;

      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({
        binary: {
          downloadDir: cacheDir
        }
      });
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[JobYatra DB] Connected successfully to In-Memory MongoDB at ${inMemoryUri}`);
    } catch (memErr) {
      console.error('[JobYatra DB] Fatal: Failed to initialize in-memory database:', memErr.message);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('[JobYatra DB] Disconnect error:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
