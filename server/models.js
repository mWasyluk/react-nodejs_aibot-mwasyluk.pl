// PaLM 2 implementation
const { GoogleAuth } = require('google-auth-library');
const { TextServiceClient } = require('@google-ai/generativelanguage').v1beta2;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(process.env.GOOGLE_API_KEY),
});

async function askPalm(prompt){
  return await client.generateText({
    model: 'models/text-bison-001',
    prompt: { text: prompt },
  }).then(result => result[0].candidates[0]?.output);
}

// Gemini implementation
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function askGemini(prompt){
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  return await model.generateContent([
      prompt,
      // {inlineData: {data: Buffer.from(fs.readFileSync('path/to/image.png')).toString("base64"),
      // mimeType: 'image/png'}}
  ]).then(result => result.response.text());
}

// Models
const models = [
  {id: 0, title: 'Gemini/1.5-flash (recommended)', sendPrompt: async (prompt) => askGemini(prompt)},
  {id: 1, title: 'PaLM2/bison-001', sendPrompt: async (prompt) => askPalm(prompt)},
];

const modelsView = models.map((model) => ({id: model.id, title: model.title}));

module.exports = {models, modelsView} ;