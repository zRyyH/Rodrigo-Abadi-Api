const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticação requerido' });
    }

    req.directusToken = authHeader.substring(7);
    next();
};

module.exports = authMiddleware;