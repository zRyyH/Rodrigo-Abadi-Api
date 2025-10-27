const disableCors = require('./src/middleware/corsMiddleware');
const uploadRoutes = require('./src/routes/upload');
const { api } = require('./src/constants/config');
const { logger, logResult } = require('./src/config/logger');
const express = require('express');

const app = express();

app.use(disableCors);
app.use(express.json());

app.use('/api', uploadRoutes);

app.listen(api.port, () => {
    logger.info('='.repeat(70));
    logger.info('SERVIDOR INICIADO');
    logger.info('='.repeat(70));
    logResult('Porta', api.port);
    logResult('Endpoint', `http://localhost:${api.port}/api/upload`);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    logger.error(`[FATAL] Uncaught Exception: ${error.message}`, { stack: error.stack });
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`[FATAL] Unhandled Rejection: ${reason}`);
});