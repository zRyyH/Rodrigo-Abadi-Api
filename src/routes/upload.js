const express = require('express');
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', uploadMiddleware, uploadController.handleUpload);

module.exports = router;