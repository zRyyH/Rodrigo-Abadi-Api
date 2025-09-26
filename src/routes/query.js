const express = require('express');
const queryController = require('../controllers/queryController');
const sqlAuthMiddleware = require('../middleware/sqlAuthMiddleware');

const router = express.Router();

router.use(sqlAuthMiddleware);

router.get('/:category/:queryName', queryController.execute);

module.exports = router;