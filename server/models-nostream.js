const { MODELS } = require("./models.config");
const { textClient, genAI, ollama } = require("./llm-clients");

/**
 * Zapytanie do Bizona (PaLM2 text-bison-001)
 */
async function askBizon(prompt) {
  const result = await textClient.generateText({
    model: MODELS.BIZON.modelName,
    prompt: { text: prompt },
  });

  return result[0].candidates[0]?.output;
}

/**
 * Zapytanie do Gemini (non-stream)
 */
async function askGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: MODELS.GEMINI.modelName });

  const result = await model.generateContent([prompt]);
  return result.response.text();
}

/**
 * Zapytanie do Ollama (non-stream)
 */
async function askOllama(prompt, modelName) {
  const result = await ollama.chat({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    think: false,
    stream: false,
  });

  return result.message.content;
}

/**
 * Jednorazowe (non-stream) API – kompatybilne z istniejącym /api/ask
 */
async function askModel(prompt, modelName) {
  switch (modelName) {
    case MODELS.BIZON.modelName:
      return askBizon(prompt);

    case MODELS.OLLAMA_1.modelName:
      return askOllama(prompt, MODELS.OLLAMA_1.modelName);

    case MODELS.OLLAMA_2.modelName:
      return askOllama(prompt, MODELS.OLLAMA_2.modelName);

    case MODELS.GEMINI.modelName:
      return askGemini(prompt);

    default:
      console.error(
        "askModel(prompt, modelName) => Selected model - '",
        modelName,
        "' has not been found."
      );
  }
}

/**
 * Akcja startowa – zagadka do logów przy starcie serwera
 */
async function getRiddle() {
  console.log("Asking for riddle...");

  return await askGemini(
    `Wymyśl krótką, jednozdaniową zagadkę logiczną, która pozwoli mi sprawdzić moc modelu LLM, jego pojmowanie świata, logikę i wydajność. Zagadkę przedstaw w takiej formie (nie dodawaj do odpowiedzi nic poza tym):\n
Podaj rozwiązanie tej zagadki wraz z uzasadnieniem: \n <tu-zagadka>`
  );
}

module.exports = {
  askBizon,
  askGemini,
  askOllama,
  askModel,
  getRiddle,
};
