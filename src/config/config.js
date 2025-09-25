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
    }
};