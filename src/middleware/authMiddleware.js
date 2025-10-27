const { logger } = require('../config/logger');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn('[Auth] Requisição sem token válido');
        return res.status(401).json({ error: 'Token de autenticação requerido' });
    }

    req.directusToken = authHeader.substring(7);
    next();
};

module.exports = authMiddleware;