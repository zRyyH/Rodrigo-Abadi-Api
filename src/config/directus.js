const { createDirectus, rest, staticToken } = require('@directus/sdk');
const { directus_api } = require('./config');

const directus = createDirectus(directus_api.directus_api_url)
    .with(rest())
    .with(staticToken(directus_api.directus_api_token));

module.exports = { directus };