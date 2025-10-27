const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Criar pasta de logs
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Formato customizado limpo e estruturado
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        const levelFormatted = level.toUpperCase().padEnd(7);
        if (stack) {
            return `${timestamp} | ${levelFormatted} | ${message}\n${stack}`;
        }
        return `${timestamp} | ${levelFormatted} | ${message}`;
    })
);

// Logger principal
const logger = winston.createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        // Console
        new winston.transports.Console(),
        // Arquivo com rotação
        new winston.transports.File({
            filename: path.join(logDir, 'app.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 3
        })
    ]
});

// Funções auxiliares para logs estruturados
const logStep = (stepNumber, totalSteps, description) => {
    logger.info(`[${stepNumber}/${totalSteps}] ${description}`);
};

const logStart = (processName) => {
    logger.info('='.repeat(70));
    logger.info(`INICIANDO: ${processName}`);
    logger.info('='.repeat(70));
};

const logEnd = (processName, success = true) => {
    const status = success ? '✅ CONCLUÍDO' : '❌ FALHOU';
    logger.info('='.repeat(70));
    logger.info(`${status}: ${processName}`);
    logger.info('='.repeat(70));
};

const logResult = (description, value) => {
    logger.info(`  → ${description}: ${value}`);
};

const logErrorDetail = (error) => {
    logger.error(`  ❌ Erro: ${error.constructor.name}`);
    logger.error(`  → ${error.message}`, { stack: error.stack });
};

module.exports = {
    logger,
    logStep,
    logStart,
    logEnd,
    logResult,
    logErrorDetail
};