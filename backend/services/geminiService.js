const { GoogleGenerativeAI } = require('@google/generative-ai');

const VISION_PROMPT = `
You are an expert cybersecurity analyst specializing in Indian digital scams.
Analyze this screenshot carefully for any signs of scam, fraud, or phishing.
If a name is saved in an image it is likely not a scam.
In text messages and links, identify using your knowledge whether it is a scam or not.
Consider: urgency language, impersonation, suspicious links, requests for money/OTP/credentials, lottery/prize claims, KYC fraud, job scams, etc.

Return ONLY a valid JSON object — no extra text, no markdown:
{
  "risk_score": <integer 0-100>,
  "scam_type": "<string, e.g. KYC Phishing / OTP Fraud / Lottery Scam / Safe Message>",
  "confidence": <integer 0-100>,
  "severity": "<Critical | Suspicious | Safe>",
  "red_flags": ["<flag 1>", "<flag 2>"],
  "indicators": ["<indicator 1>", "<indicator 2>"],
  "recommended_action": "<clear actionable advice>",
  "ai_explanation": "<2-3 sentence explanation of why this is or is not a scam>"
}
`;

const TEXT_PROMPT = `
You are an expert cybersecurity analyst specializing in Indian digital scams.
Analyze the following message carefully for signs of scam, fraud, or phishing.
Consider: urgency language, impersonation, suspicious links, requests for money/OTP/credentials, lottery/prize claims, KYC fraud, job scams, etc.

Return ONLY a valid JSON object — no extra text, no markdown:
{
  "risk_score": <integer 0-100>,
  "scam_type": "<string, e.g. KYC Phishing / OTP Fraud / Lottery Scam / Safe Message>",
  "red_flags": ["<flag 1>", "<flag 2>"],
  "recommended_action": "<clear actionable advice>",
  "ai_explanation": "<2-3 sentence explanation of why this is or is not a scam>"
}
`;

const URL_PROMPT = `
You are an expert cybersecurity analyst specializing in phishing and malicious URLs.
Analyze the following URL for signs of phishing, scam, or malicious activity.
Look for: lookalike domains, suspicious TLDs, URL shorteners hiding destinations, credential-harvesting paths, non-HTTPS, brand impersonation, etc.

Return ONLY a valid JSON object — no extra text, no markdown:
{
  "risk_score": <integer 0-100>,
  "scam_type": "<string, e.g. Phishing / Lookalike Domain / Malicious Redirect / Safe URL>",
  "red_flags": ["<flag 1>", "<flag 2>"],
  "recommended_action": "<clear actionable advice>",
  "ai_explanation": "<2-3 sentence explanation of the URL's risk factors>"
}
`;

const getClient = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API Key is missing');
  }
  return new GoogleGenerativeAI(apiKey);
};

const extractJson = (text) => {
  const raw = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(raw);
  parsed.ai_powered = true;
  return parsed;
};

const analyzeImageWithGemini = async (file, lang = 'en') => {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  let prompt = VISION_PROMPT;
  if (lang === 'hi') {
    prompt += '\nTranslate your entire JSON response values into conversational Hindi.';
  }

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: file.buffer.toString("base64"),
        mimeType: file.mimetype,
      }
    }
  ]);

  return extractJson(result.response.text());
};

const analyzeTextWithGemini = async (text, lang = 'en') => {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  let prompt = TEXT_PROMPT;
  if (lang === 'hi') {
    prompt += '\nTranslate your entire JSON response values into conversational Hindi.';
  }

  const result = await model.generateContent([prompt, `\n\nMessage to analyze:\n${text}`]);
  return extractJson(result.response.text());
};

const analyzeUrlWithGemini = async (url, lang = 'en') => {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  let prompt = URL_PROMPT;
  if (lang === 'hi') {
    prompt += '\nTranslate your entire JSON response values into conversational Hindi.';
  }

  const result = await model.generateContent([prompt, `\n\nURL to analyze:\n${url}`]);
  return extractJson(result.response.text());
};

module.exports = {
  analyzeImageWithGemini,
  analyzeTextWithGemini,
  analyzeUrlWithGemini
};
