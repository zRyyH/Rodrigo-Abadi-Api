const pool = require('../config/mysql');
const queries = require('../queries');

class QueryExecutor {
    static async run(category, queryName, params = {}) {
        const categoryQueries = queries[category];

        if (!categoryQueries) {
            throw new Error(`Categoria não encontrada: ${category}`);
        }

        const query = categoryQueries[queryName];

        if (!query) {
            throw new Error(`Query não encontrada: ${category}/${queryName}`);
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