require('dotenv').config();

module.exports = {
    directus_api: {
        directus_api_url: process.env.DIRECTUS_API_URL,
        directus_api_token: process.env.DIRECTUS_API_TOKEN
    },
    server: {
        port: process.env.PORT
    },
    upload: {
        maxFileSize: 10485760,
        maxFiles: 2,
        allowedMimeTypes: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
};