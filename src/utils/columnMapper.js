const DataTransformer = require('./dataTransformer');

class ColumnMapper {
    static mapRows(rawData, columnMap, transforms = {}) {
        return rawData
            .map(row => this.mapRow(row, columnMap, transforms))
            .filter(row => this.hasValidData(row));
    }

    static mapRow(row, columnMap, transforms) {
        const mapped = {};

        Object.entries(columnMap).forEach(([colIndex, fieldName]) => {
            const colNumber = this.columnToIndex(colIndex);
            const rawValue = row[colNumber];

            if (rawValue !== undefined && rawValue !== '') {
                const transformType = transforms[fieldName];
                mapped[fieldName] = DataTransformer.transformValue(rawValue, transformType);
            } else {
                mapped[fieldName] = DataTransformer.getDefaultValue(transforms[fieldName]);
            }
        });

        return mapped;
    }

    static columnToIndex(column) {
        if (typeof column === 'number') return column;

        let result = 0;
        for (let i = 0; i < column.length; i++) {
            result = result * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
        }
        return result - 1;
    }

    static hasValidData(row) {
        return Object.values(row).some(value =>
            value !== null &&
            value !== undefined &&
            value !== '' &&
            value !== 0
        );
    }
}

module.exports = ColumnMapper;