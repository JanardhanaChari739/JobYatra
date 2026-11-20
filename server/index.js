require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const Job = require('./src/models/Job');
const universalAggregator = require('./src/services/aggregator');
const { seedInitialData } = require('./src/scripts/seed');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Connect to Database (or start In-Memory fallback)
    await connectDB();

    // 2. Check if jobs exist; if empty, automatically run initial seed & aggregation
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log('[JobYatra] Fresh database detected. Running initial Indian jobs aggregation seed...');
      await seedInitialData();
    } else {
      console.log(`[JobYatra] Database ready with ${jobCount} active opportunities.`);
    }

    // 3. Start Express server
    const server = app.listen(PORT, () => {
      console.log(`
=============================================================
🚀 JobYatra API Server Running Successfully!
=============================================================
📍 Port:        http://localhost:${PORT}
🌐 API Base:    http://localhost:${PORT}/api/v1
🔍 Health:      http://localhost:${PORT}/api/v1/health
💼 Jobs API:    http://localhost:${PORT}/api/v1/jobs
🏢 Companies:   http://localhost:${PORT}/api/v1/companies
⚡ Tagline:     "Every Portal. One Search."
=============================================================
      `);
    });

    const shutdown = async () => {
      console.log('\n[JobYatra] Gracefully shutting down server...');
      server.close(() => {
        console.log('[JobYatra] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[JobYatra] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
