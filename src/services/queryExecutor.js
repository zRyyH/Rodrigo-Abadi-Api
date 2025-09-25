const pool = require('../config/mysql');
const queries = require('../queries');

class QueryExecutor {
    static async run(queryName, params = {}) {
        const query = queries[queryName];

        if (!query) {
            throw new Error(`Query não encontrada: ${queryName}`);
        }

        const queryParams = query.params.map(param => params[param]);

        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(query.sql, queryParams);
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = QueryExecutor;