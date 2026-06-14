const axios = require('axios');

const checkSafeBrowsing = async (url) => {
  const protocol_warning = url.startsWith("http://");
  
  const apiKey = process.env.API_KEY || process.env.SAFE_BROWSING_API_KEY;
  if (!apiKey) {
    throw new Error('API Key is missing');
  }

  const body = {
    client: {
      clientId: "scamshield",
      clientVersion: "1.0"
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [
        { url: url }
      ]
    }
  };

  try {
    const response = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      body
    );

    return {
      unsafe_protocol: protocol_warning,
      google_result: response.data
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  checkSafeBrowsing
};
