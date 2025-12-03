const app = require('./app');
const prisma = require('./config/db');
const ENV = require('./config/env');

const server = app.listen(ENV.PORT, () => {
    console.log(` Server running on port ${ENV.PORT}`);
    console.log(` Environment: ${ENV.NODE_ENV}`);
    console.log(` Health check: http://localhost:${ENV.PORT}/health`);
});

// Graceful shutdown
const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    await prisma.$disconnect();
    server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
