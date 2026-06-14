const express = require('express');
const { scanUrl } = require('../controllers/scanController');

const router = express.Router();

router.post('/scan-url', scanUrl);

module.exports = router;
