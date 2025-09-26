const QueryExecutor = require('../services/queryExecutor');

exports.execute = async (req, res) => {
    const { category, queryName } = req.params;
    const params = req.query;

    try {
        const results = await QueryExecutor.run(category, queryName, params);
        res.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};