const { createDirectus, rest, staticToken } = require('@directus/sdk');
const { server } = require('./config');

const createDirectusClient = (token) => {
    return createDirectus(server.directus_url).with(rest()).with(staticToken(token));
};

module.exports = { createDirectusClient };