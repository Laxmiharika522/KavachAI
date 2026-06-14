const express = require('express');
const multer = require('multer');
const { analyzeImage, analyzeText, analyzeUrl } = require('../controllers/analyzeController');

const router = express.Router();

// Setup multer for memory storage (file buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/analyze-image', upload.single('file'), analyzeImage);
router.post('/analyze-text', analyzeText);
router.post('/analyze-url', analyzeUrl);

module.exports = router;
