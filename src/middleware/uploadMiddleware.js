const multer = require('multer');
const config = require('../config/config');

const upload = multer({
    limits: {
        fileSize: config.upload.maxFileSize
    },
    fileFilter: (req, file, cb) => {
        const isAllowed = config.upload.allowedMimeTypes.includes(file.mimetype);
        cb(null, isAllowed);
    }
});

module.exports = upload.fields([
    { name: 'fileSales', maxCount: 1 },
    { name: 'fileInvoices', maxCount: 1 }
]);