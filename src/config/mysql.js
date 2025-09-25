const mysql = require('mysql2/promise');
const { mysql: config } = require('./config');

const pool = mysql.createPool(config);

module.exports = pool;