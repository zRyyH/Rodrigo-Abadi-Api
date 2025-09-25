const SqlService = require('../services/sqlService');

exports.execute = async (req, res) => {
    const { query, params } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query SQL requerida' });
    }

    try {
        const results = await SqlService.execute(query, params || []);
        res.json({
            success: true,
            data: results,
            count: Array.isArray(results) ? results.length : 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};