const XLSX = require('xlsx');

class XlsxParser {
    static parse(buffer, options = {}) {
        const {
            startRow = 1,
            sheetIndex = 0,
            sheetName
        } = options;

        try {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const targetSheet = sheetName
                ? workbook.Sheets[sheetName]
                : workbook.Sheets[workbook.SheetNames[sheetIndex]];

            if (!targetSheet) {
                throw new Error(`Planilha não encontrada: ${sheetName || sheetIndex}`);
            }

            return XLSX.utils.sheet_to_json(targetSheet, {
                header: 1,
                defval: '',
                range: startRow
            });

        } catch (error) {
            throw new Error(`Erro ao processar XLSX: ${error.message}`);
        }
    }
}

module.exports = XlsxParser;