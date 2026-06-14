const { checkSafeBrowsing } = require('../services/safeBrowsingService');

const scanUrl = async (req, res) => {
  try {
    const url = req.body.url;
    if (!url) {
      return res.status(400).json({ detail: "No url provided" });
    }

    const result = await checkSafeBrowsing(url);
    res.json(result);
  } catch (error) {
    console.error("Error scanning url:", error);
    res.status(503).json({ detail: error.message });
  }
};

module.exports = {
  scanUrl
};
