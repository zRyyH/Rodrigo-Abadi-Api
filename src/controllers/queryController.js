const QueryExecutor = require('../services/queryExecutor');

exports.execute = async (req, res) => {
    console.log(req)

    const { queryName } = req.params;
    const params = req.query;

    try {
        const results = await QueryExecutor.run(queryName, params);
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