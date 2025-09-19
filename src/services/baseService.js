const { directus } = require('../config/directus');
const { createItems, readItems, updateItemsBatch } = require('@directus/sdk');
const FileProcessor = require('../utils/fileProcessor');

class BaseService {
    static parse(buffer, columnMap, transforms, options) {
        return FileProcessor.process(buffer, {
            columnMap,
            transforms,
            ...options
        });
    }

    static async upsert(data, collection, uniqueField) {
        const uniqueValues = data.map(item => item[uniqueField]).filter(Boolean);
        const batchSize = 25;
        const existingMap = new Map();

        for (let i = 0; i < uniqueValues.length; i += batchSize) {
            const batch = uniqueValues.slice(i, i + batchSize);

            const existing = await directus.request(
                readItems(collection, {
                    filter: { [uniqueField]: { _in: batch } },
                    fields: ['id', uniqueField],
                    limit: -1
                })
            );

            const existingArray = Array.isArray(existing) ? existing : [];

            existingArray.forEach(item => {
                existingMap.set(String(item[uniqueField]), item.id);
            });
        }

        const toCreate = [];
        const toUpdate = [];

        data.forEach(item => {
            const key = String(item[uniqueField]);
            const existingId = existingMap.get(key);

            if (existingId) {
                toUpdate.push({ id: existingId, ...item });
            } else {
                toCreate.push(item);
            }
        });

        const results = { created: 0, updated: 0 };

        if (toCreate.length) {
            await directus.request(createItems(collection, toCreate));
            results.created = toCreate.length;
        }

        if (toUpdate.length) {
            await directus.request(updateItemsBatch(collection, toUpdate));
            results.updated = toUpdate.length;
        }

        return results;
    }
}

module.exports = BaseService;