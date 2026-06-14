const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const TRANSLATIONS_PATH = path.join(__dirname, '../../frontend/src/translations.js');

async function autoTranslate() {
  console.log("🚀 Starting Automatic UI Translation...");
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY is missing from backend/.env");
    process.exit(1);
  }

  // 1. Read the translations file
  const fileContent = fs.readFileSync(TRANSLATIONS_PATH, 'utf8');
  
  // Quick and dirty way to parse the export without complex AST
  // This removes the "export const t = " and parses the object
  const objectString = fileContent.replace('export const t = ', '').replace(/;[\s\n]*$/, '');
  
  let t;
  try {
    // using eval to safely parse standard JS object syntax (which might lack quotes on keys)
    t = eval('(' + objectString + ')');
  } catch (e) {
    console.error("❌ Failed to parse translations.js", e);
    process.exit(1);
  }

  const enKeys = Object.keys(t.en);
  const hiKeys = Object.keys(t.hi);
  
  const missingKeys = enKeys.filter(key => !hiKeys.includes(key));

  if (missingKeys.length === 0) {
    console.log("✅ All English strings are already translated into Hindi! Nothing to do.");
    process.exit(0);
  }

  console.log(`🔍 Found ${missingKeys.length} new English strings to translate:`, missingKeys);

  // 2. Prepare the payload for Gemini
  const textToTranslate = missingKeys.map(key => `"${key}": "${t.en[key]}"`).join('\n');

  console.log("🤖 Asking Gemini AI to translate...");
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert English to Hindi translator for a UI Dashboard.
Please translate the following UI strings into conversational Hindi suitable for an app.
Return ONLY a valid JSON object where the keys exactly match the keys provided, and the values are the Hindi translations.
Do not include markdown blocks like \`\`\`json. Just the raw JSON object.

Strings to translate:
{
${textToTranslate}
}
  `;

  try {
    const result = await model.generateContent(prompt);
    let responseText = result.response.text().trim();
    
    // Clean up any potential markdown formatting the AI might add
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/```/g, '').trim();
    }

    const newTranslations = JSON.parse(responseText);

    // 3. Merge new translations
    for (const key of missingKeys) {
      if (newTranslations[key]) {
        t.hi[key] = newTranslations[key];
        console.log(`✅ Translated "${key}": ${newTranslations[key]}`);
      } else {
        console.warn(`⚠️ Warning: Gemini missed key "${key}"`);
      }
    }

    // 4. Write back to the file
    const newContent = `export const t = ${JSON.stringify(t, null, 2)};\n`;
    fs.writeFileSync(TRANSLATIONS_PATH, newContent, 'utf8');

    console.log("🎉 Successfully updated translations.js!");

  } catch (error) {
    console.error("❌ Translation failed:", error);
  }
}

autoTranslate();
