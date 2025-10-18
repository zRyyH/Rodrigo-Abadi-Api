const rabbitmqService = require('../services/rabbitmqService');
const DirectusFileService = require('../services/directusFileService');

exports.handleUpload = async (req, res) => {
    const { sales_xlsx, nfes_xlsx, xml_zip, pdf_zip } = req.files || {};

    // Validação: todos os arquivos são obrigatórios
    if (!sales_xlsx || !nfes_xlsx || !xml_zip || !pdf_zip) {
        return res.status(400).json({
            error: 'Envie todos os arquivos necessários: sales_xlsx, nfes_xlsx, xml_zip, pdf_zip',
            received: {
                sales_xlsx: !!sales_xlsx,
                nfes_xlsx: !!nfes_xlsx,
                xml_zip: !!xml_zip,
                pdf_zip: !!pdf_zip
            }
        });
    }

    try {
        console.log('📤 Iniciando upload dos arquivos para o Directus...');

        // Criar instância do serviço de upload com o token do usuário
        const directusFileService = new DirectusFileService(req.directusToken);

        // Fazer upload de todos os arquivos para o Directus
        const uploadedFiles = await directusFileService.uploadMultipleFiles({
            sales_xlsx,
            nfes_xlsx,
            xml_zip,
            pdf_zip
        });

        // Preparar dados para enviar à fila (agora com links em vez de base64)
        const filesData = {
            timestamp: new Date().toISOString(),
            userId: req.directusToken,
            files: {
                sales_xlsx: {
                    id: uploadedFiles.sales_xlsx.id,
                    originalName: uploadedFiles.sales_xlsx.filename,
                    downloadUrl: uploadedFiles.sales_xlsx.downloadUrl,
                    size: uploadedFiles.sales_xlsx.size,
                    mimetype: uploadedFiles.sales_xlsx.mimetype
                },
                nfes_xlsx: {
                    id: uploadedFiles.nfes_xlsx.id,
                    originalName: uploadedFiles.nfes_xlsx.filename,
                    downloadUrl: uploadedFiles.nfes_xlsx.downloadUrl,
                    size: uploadedFiles.nfes_xlsx.size,
                    mimetype: uploadedFiles.nfes_xlsx.mimetype
                },
                xml_zip: {
                    id: uploadedFiles.xml_zip.id,
                    originalName: uploadedFiles.xml_zip.filename,
                    downloadUrl: uploadedFiles.xml_zip.downloadUrl,
                    size: uploadedFiles.xml_zip.size,
                    mimetype: uploadedFiles.xml_zip.mimetype
                },
                pdf_zip: {
                    id: uploadedFiles.pdf_zip.id,
                    originalName: uploadedFiles.pdf_zip.filename,
                    downloadUrl: uploadedFiles.pdf_zip.downloadUrl,
                    size: uploadedFiles.pdf_zip.size,
                    mimetype: uploadedFiles.pdf_zip.mimetype
                }
            }
        };

        // Enviar para fila RabbitMQ
        await rabbitmqService.sendToQueue(filesData);

        console.log('✅ Arquivos enviados para processamento');

        res.json({
            message: 'Arquivos enviados para processamento com sucesso',
            status: 'processing',
            filesUploaded: {
                sales_xlsx: {
                    filename: uploadedFiles.sales_xlsx.filename,
                    id: uploadedFiles.sales_xlsx.id,
                    url: uploadedFiles.sales_xlsx.downloadUrl
                },
                nfes_xlsx: {
                    filename: uploadedFiles.nfes_xlsx.filename,
                    id: uploadedFiles.nfes_xlsx.id,
                    url: uploadedFiles.nfes_xlsx.downloadUrl
                },
                xml_zip: {
                    filename: uploadedFiles.xml_zip.filename,
                    id: uploadedFiles.xml_zip.id,
                    url: uploadedFiles.xml_zip.downloadUrl
                },
                pdf_zip: {
                    filename: uploadedFiles.pdf_zip.filename,
                    id: uploadedFiles.pdf_zip.id,
                    url: uploadedFiles.pdf_zip.downloadUrl
                }
            },
            timestamp: filesData.timestamp
        });

    } catch (error) {
        console.error('❌ Erro ao processar arquivos:', error);
        res.status(500).json({
            error: 'Erro ao processar arquivos',
            details: error.message
        });
    }
};