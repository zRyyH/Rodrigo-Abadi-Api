const BaseService = require('./baseService');
const { SALES_COLUMN_MAP, SALES_TRANSFORMS, SALES_CONFIG } = require('../constants/salesConstants');

class SalesService extends BaseService {
    static parse(buffer) {
        return super.parse(buffer, SALES_COLUMN_MAP, SALES_TRANSFORMS, {
            startRow: SALES_CONFIG.startRow
        });
    }

    static async upsert(data) {
        return await super.upsert(data, SALES_CONFIG.collection, SALES_CONFIG.uniqueField);
    }
}

module.exports = SalesService;