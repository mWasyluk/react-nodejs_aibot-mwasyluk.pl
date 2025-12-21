const { MODELS } = require("./models.config");
const { genAI, ollama } = require("./llm-clients");
const { askBizon } = require("./models-nostream");

/**
 * @typedef {Object} StreamChunk
 * @property {"thinking" | "final" | "error"} type
 * @property {string} delta   // nowy fragment tekstu
 * @property {string} full    // dotychczasowa całość
 * @property {boolean} done   // czy stream dla tego typu się zakończył
 */

/**
 * Streaming dla Ollama (prawdziwy stream; opcjonalny reasoning/thinking)
 */
async function* askOllamaStream(prompt, modelName) {
  const stream = await ollama.chat({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    think: true,  // jeśli model wspiera reasoning, to tutaj poleci "thinking"
    stream: true,
  });

  let fullThinking = "";
  let fullFinal = "";

  for await (const chunk of stream) {
    const msg = chunk.message || {};

    // potencjalne pole z procesem myślenia (zależne od modelu)
    const thinkingDelta = msg.thinking || msg.reasoning || "";
    if (thinkingDelta) {
      fullThinking += thinkingDelta;

      /** @type {StreamChunk} */
      const thinkingEvent = {
        type: "thinking",
        delta: thinkingDelta,
        // full: fullThinking,
        done: false,
      };

      yield thinkingEvent;
    }

    // klasyczna treść odpowiedzi
    const finalDelta = msg.content || "";
    if (finalDelta) {
      fullFinal += finalDelta;

      /** @type {StreamChunk} */
      const finalEvent = {
        type: "final",
        delta: finalDelta,
        // full: fullFinal,
        done: false,
      };

      yield finalEvent;
    }
  }

  /** @type {StreamChunk} */
  const doneEvent = {
    type: "final",
    delta: "",
    full: fullFinal,
    done: true,
  };

  yield doneEvent;
}

/**
 * Streaming dla Gemini (generateContentStream)
 * Tu mamy tylko "final" – Gemini nie rozdziela na thinking/final w API.
 */
async function* askGeminiStream(prompt) {
  const model = genAI.getGenerativeModel({ model: MODELS.GEMINI.modelName });

  const result = await model.generateContentStream(prompt);

  let full = "";

  for await (const chunk of result.stream) {
    const delta = typeof chunk.text === "function" ? chunk.text() : "";
    if (!delta) {
      continue;
    }

    full += delta;

    /** @type {StreamChunk} */
    const event = {
      type: "final",
      delta,
    //   full,
      done: false,
    };

    yield event;
  }

  /** @type {StreamChunk} */
  const doneEvent = {
    type: "final",
    delta: "",
    full,
    done: true,
  };

  yield doneEvent;
}

/**
 * Fallback streaming dla modeli bez natywnego streamu:
 * zwraca jeden event "final" done=true.
 */
async function* askBizonStream(prompt) {
  const text = await askBizon(prompt);
  const safe = text || "";

  /** @type {StreamChunk} */
  const event = {
    type: "final",
    delta: safe,
    full: safe,
    done: true,
  };

  yield event;
}

/**
 * Globalny streamingowy kontrakt:
 * async function* askModelStream(prompt, modelName)
 */
async function* askModelStream(prompt, modelName) {
  switch (modelName) {
    case MODELS.OLLAMA_1.modelName:
    case MODELS.OLLAMA_2.modelName:
      yield* askOllamaStream(prompt, modelName);
      return;

    case MODELS.GEMINI.modelName:
      yield* askGeminiStream(prompt);
      return;

    case MODELS.BIZON.modelName:
      // model i tak jest disabled, ale kontrakt jest kompletny
      yield* askBizonStream(prompt);
      return;

    default:
      throw new Error("Model does not support streaming: " + modelName);
  }
}

module.exports = {
  askModelStream,
  askOllamaStream,
  askGeminiStream,
  askBizonStream,
};
