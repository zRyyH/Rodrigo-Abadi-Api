const SalesService = require('../services/salesService');
const NfesService = require('../services/nfesService');

exports.handleUpload = async (req, res) => {
    if (!req.files?.fileSales || !req.files?.fileInvoices) {
        return res.status(400).json({ error: 'Envie ambos arquivos: fileSales e fileInvoices' });
    }

    try {
        const salesData = SalesService.parse(req.files.fileSales[0].buffer);
        const nfesData = NfesService.parse(req.files.fileInvoices[0].buffer);

        const [salesResult, nfesResult] = await Promise.all([
            salesData.length ? SalesService.upsert(salesData) : { created: 0, updated: 0 },
            nfesData.length ? NfesService.upsert(nfesData) : { created: 0, updated: 0 }
        ]);

        res.json({
            message: 'Processado com sucesso',
            results: {
                sales: salesResult,
                nfes: nfesResult
            }
        });

    } catch (error) {
        console.error('❌ Erro:', error);
        res.status(500).json({ error: error.message });
    }
};