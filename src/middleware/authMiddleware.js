const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const expectedToken = process.env.API_BEARER_TOKEN;

    if (!expectedToken) {
        return res.status(500).json({ error: 'Token não configurado no servidor' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticação requerido' });
    }

    const token = authHeader.substring(7);

    if (token !== expectedToken) {
        return res.status(403).json({ error: 'Token inválido' });
    }

    next();
};

module.exports = authMiddleware;