const { MODELS } = require("./models.config");
const { askModel, getRiddle } = require("./models-nostream");
const { askModelStream } = require("./models-stream");

// Budujemy obiekty modeli w jednym miejscu
const modelObjects = Object.values(MODELS)
  .filter((model) => !model.disabled)
  .map((model, i) => ({
    ...model,
    id: i,
    // stare API – jednorazowa odpowiedź
    sendPrompt: (prompt) => askModel(prompt, model.modelName),
    // nowe API – async generator dla streamingu
    sendPromptStream: (prompt) => askModelStream(prompt, model.modelName),
  }));

// Zachowujemy to samo zachowanie co wcześniej:
// actions.riddle to PROMISE, odpalony przy starcie serwera.
const riddlePromise = getRiddle();

module.exports = {
  models: modelObjects,
  actions: { riddle: riddlePromise },
  // Przy okazji eksportujemy funkcje, jakby backend miał je kiedyś wołać bezpośrednio
  askModel,
  askModelStream,
};
