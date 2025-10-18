const multer = require('multer');
const config = require('../constants/config');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: config.upload.maxFileSize
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = Object.values(config.upload.allowedMimeTypes);
        const isAllowed = allowedMimeTypes.includes(file.mimetype);

        if (!isAllowed) {
            return cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}`));
        }

        cb(null, true);
    }
});

module.exports = upload.fields([
    { name: 'sales_xlsx', maxCount: 1 },
    { name: 'nfes_xlsx', maxCount: 1 },
    { name: 'xml_zip', maxCount: 1 },
    { name: 'pdf_zip', maxCount: 1 }
]);