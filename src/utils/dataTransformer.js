const XLSX = require('xlsx');

class DataTransformer {
    static MONTHS_PT = {
        'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
        'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
        'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
    };

    static transformValue(value, type) {
        if (!value && value !== 0) return this.getDefaultValue(type);

        switch (type) {
            case 'currency':
                return this.parseCurrency(value);
            case 'number':
                return this.parseNumber(value);
            case 'date':
                return this.parseDate(value);
            case 'boolean':
                return this.parseBoolean(value);
            case 'string':
            default:
                return String(value).trim();
        }
    }

    static parseCurrency(value) {
        return parseFloat(
            String(value)
                .replace(/[R$\s]/g, '')
                .replace(/\./g, '')
                .replace(',', '.')
        ) || 0;
    }

    static parseNumber(value) {
        const num = parseFloat(String(value).replace(',', '.'));
        return isNaN(num) ? 0 : num;
    }

    static parseDate(value) {
        try {
            if (typeof value === 'number') {
                return XLSX.SSF.parse_date_code(value);
            }

            const str = String(value).trim();

            const ptBrMatch = str.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})\s+(\d{2}):(\d{2})\s+hs/);
            if (ptBrMatch) {
                const [, day, monthName, year, hour, minute] = ptBrMatch;
                const month = this.MONTHS_PT[monthName.toLowerCase()];

                if (month) {
                    return new Date(`${year}-${month}-${day.padStart(2, '0')}T${hour}:${minute}:00.000Z`).toISOString();
                }
            }

            const ptBrDateMatch = str.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/);
            if (ptBrDateMatch) {
                const [, day, monthName, year] = ptBrDateMatch;
                const month = this.MONTHS_PT[monthName.toLowerCase()];

                if (month) {
                    return new Date(`${year}-${month}-${day.padStart(2, '0')}T00:00:00.000Z`).toISOString();
                }
            }

            const fullMatch = str.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
            if (fullMatch) {
                const [, day, month, year, hour, minute, second] = fullMatch;
                return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`).toISOString();
            }

            const dateMatch = str.match(/(\d{2})\/(\d{2})\/(\d{4})/);
            if (dateMatch) {
                const [, day, month, year] = dateMatch;
                return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
            }

            const parsed = new Date(value);
            return isNaN(parsed.getTime()) ? null : parsed.toISOString();

        } catch {
            return null;
        }
    }

    static parseBoolean(value) {
        const str = String(value).toLowerCase().trim();
        return ['true', '1', 'sim', 'yes', 's', 'y'].includes(str);
    }

    static getDefaultValue(type) {
        switch (type) {
            case 'currency':
            case 'number':
                return 0;
            case 'boolean':
                return false;
            case 'date':
                return null;
            case 'string':
            default:
                return '';
        }
    }
}

module.exports = DataTransformer;