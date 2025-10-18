require('dotenv').config();

module.exports = {
    api: {
        port: 3000
    },
    directusApi: {
        url: process.env.DIRECTUS_API_URL,
        port: process.env.PORT
    },
    upload: {
        maxFileSize: 10485760, // 10MB
        maxFiles: 4,
        allowedMimeTypes: {
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            zip: 'application/zip'
        }
    },
    rabbitmq: {
        host: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        user: process.env.RABBITMQ_USER,
        pass: process.env.RABBITMQ_PASSWORD,
        queue: process.env.RABBITMQ_QUEUE || 'file_processing'
    }
};