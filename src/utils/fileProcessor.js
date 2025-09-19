const XlsxParser = require('./xlsxParser');
const ColumnMapper = require('./columnMapper');

class FileProcessor {
    static process(buffer, options = {}) {
        const {
            columnMap = {},
            transforms = {},
            filter,
            ...xlsxOptions
        } = options;

        const rawData = XlsxParser.parse(buffer, xlsxOptions);

        let processedData = ColumnMapper.mapRows(rawData, columnMap, transforms);

        if (filter) {
            processedData = processedData.filter(filter);
        }

        return processedData;
    }
}

module.exports = FileProcessor;