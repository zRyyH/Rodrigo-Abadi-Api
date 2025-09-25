const { createDirectusClient } = require('../config/directus');
const { readMe } = require('@directus/sdk');

const sqlAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    const token = authHeader.substring(7);

    try {
        const directus = createDirectusClient(token);
        await directus.request(readMe());
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = sqlAuthMiddleware;