const { createDirectus, rest, staticToken } = require('@directus/sdk');
const { directusApi } = require('../constants/config');

const createDirectusClient = (token) => {
    return createDirectus(directusApi.url).with(rest()).with(staticToken(token));
};

module.exports = { createDirectusClient };