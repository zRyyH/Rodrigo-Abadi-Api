const { createDirectusClient } = require('../config/directus');
const { directusApi } = require('../constants/config');
const FormData = require('form-data');
const axios = require('axios');

class DirectusFileService {
    constructor(token) {
        this.client = createDirectusClient(token);
        this.token = token;
    }

    async uploadFile(fileBuffer, filename, mimetype) {
        try {
            const hoje = new Date();
            const formData = new FormData();
            formData.append('file', fileBuffer, {
                filename: `${hoje.toLocaleDateString('pt-BR').replace(/\//g, '-')}-${filename}`,
                contentType: mimetype,
            });

            // Upload usando axios
            const response = await axios.post(`${directusApi.url}/files`, formData, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    ...formData.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });

            const fileData = response.data.data;

            console.log(`✅ Arquivo ${filename} enviado para Directus`);

            return {
                id: fileData.id,
                filename: fileData.filename_disk,
                filename_download: fileData.filename_download,
                title: fileData.title,
                type: fileData.type,
                filesize: fileData.filesize
            };
        } catch (error) {
            const errorMsg = error.response?.data || error.message;
            console.error(`❌ Erro ao fazer upload do arquivo ${filename}:`, errorMsg);
            throw new Error(`Falha no upload do arquivo ${filename}: ${JSON.stringify(errorMsg)}`);
        }
    }

    getDownloadUrl(fileId) {
        const { directusApi } = require('../constants/config');
        return `${directusApi.url}/assets/${fileId}`;
    }

    async uploadMultipleFiles(files) {
        const uploadedFiles = {};

        for (const [fieldName, fileArray] of Object.entries(files)) {
            const file = fileArray[0]; // Pega o primeiro arquivo de cada campo

            const uploadResult = await this.uploadFile(
                file.buffer,
                file.originalname,
                file.mimetype
            );

            uploadedFiles[fieldName] = {
                id: uploadResult.id,
                filename: uploadResult.filename_download,
                downloadUrl: this.getDownloadUrl(uploadResult.id),
                size: uploadResult.filesize,
                mimetype: file.mimetype
            };
        }

        return uploadedFiles;
    }
}

module.exports = DirectusFileService;