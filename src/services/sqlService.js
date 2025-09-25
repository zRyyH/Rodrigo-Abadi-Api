const pool = require('../config/mysql');

class SqlService {
    static async execute(query, params = []) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(query, params);
            return rows;
        } finally {
            connection.release();
        }
    }

    static async query(sql, params = []) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(sql, params);
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = SqlService;