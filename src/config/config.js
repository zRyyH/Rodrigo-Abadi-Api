require('dotenv').config();

module.exports = {
    server: {
        directus_url: process.env.DIRECTUS_API_URL,
        port: process.env.PORT
    },
    upload: {
        maxFileSize: 10485760,
        maxFiles: 2,
        allowedMimeTypes: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    mysql: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
};