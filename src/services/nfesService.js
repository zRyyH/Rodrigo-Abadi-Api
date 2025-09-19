const BaseService = require('./baseService');
const { NFES_COLUMN_MAP, NFES_TRANSFORMS, NFES_CONFIG } = require('../constants/nfesConstants');

class NfesService extends BaseService {
    static parse(buffer) {
        return super.parse(buffer, NFES_COLUMN_MAP, NFES_TRANSFORMS, {
            sheetName: NFES_CONFIG.sheetName,
            startRow: NFES_CONFIG.startRow
        });
    }

    static async upsert(data) {
        return await super.upsert(data, NFES_CONFIG.collection, NFES_CONFIG.uniqueField);
    }
}

module.exports = NfesService;