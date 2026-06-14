const { analyzeImageWithGemini, analyzeTextWithGemini, analyzeUrlWithGemini } = require('../services/geminiService');

const analyzeImage = async (req, res) => {
  try {
    const lang = req.body.lang || req.query.lang || 'en';
    const file = req.file;
    if (!file) {
      return res.status(400).json({ detail: "No file uploaded" });
    }
    
    const result = await analyzeImageWithGemini(file, lang);
    res.json(result);
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(503).json({ detail: error.message });
  }
};

const analyzeText = async (req, res) => {
  try {
    const lang = req.body.lang || req.query.lang || 'en';
    const text = req.body.text;
    if (!text) {
      return res.status(400).json({ detail: "No text provided" });
    }

    const result = await analyzeTextWithGemini(text, lang);
    res.json(result);
  } catch (error) {
    console.error("Error analyzing text:", error);
    res.status(503).json({ detail: error.message });
  }
};

const analyzeUrl = async (req, res) => {
  try {
    const lang = req.body.lang || req.query.lang || 'en';
    const url = req.body.url;
    if (!url) {
      return res.status(400).json({ detail: "No url provided" });
    }

    const result = await analyzeUrlWithGemini(url, lang);
    res.json(result);
  } catch (error) {
    console.error("Error analyzing url:", error);
    res.status(503).json({ detail: error.message });
  }
};

module.exports = {
  analyzeImage,
  analyzeText,
  analyzeUrl
};
