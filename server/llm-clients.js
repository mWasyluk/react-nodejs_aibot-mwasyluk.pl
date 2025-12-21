const { GoogleAuth } = require("google-auth-library");
const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Ollama } = require("ollama");

// PaLM / Bizona
const textClient = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(process.env.AIBOT_GOOGLE_KEY),
});

// Gemini
const genAI = new GoogleGenerativeAI(process.env.AIBOT_GOOGLE_KEY);

// Ollama (cloud hosted)
const ollama = new Ollama({
  host: "https://ollama.com",
  headers: {
    Authorization: "Bearer " + process.env.AIBOT_OLLAMA_KEY,
  },
});

module.exports = {
  textClient,
  genAI,
  ollama,
};
