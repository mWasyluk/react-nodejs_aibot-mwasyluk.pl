const MODELS = {
  OLLAMA_1: { modelName: "gpt-oss:120b", title: "GPT-OSS, 120B (recommended)" },
  GEMINI: { modelName: "gemini-2.5-flash", title: "Gemini/2.5-flash" },
  OLLAMA_2: { modelName: "ministral-3:14b", title: "Ministral 3, 14B" },
  BIZON: { modelName: "models/text-bison-001", title: "PaLM2/bison-001", disabled: true },
};

module.exports = { MODELS };
