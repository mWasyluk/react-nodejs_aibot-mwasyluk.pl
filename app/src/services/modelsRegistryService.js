import { MODELS_URL } from '../utils/api-util';

/**
 * @typedef {'ok'|'missing'|'error'|'requiresConfig'} ModelStatus
 *
 * @typedef {Object} ModelRegistryItem
 * @property {string|number} id
 * @property {string} title
 * @property {string=} modelName
 * @property {string=} provider
 * @property {string=} runtimeId
 */

/**
 * Very small "model registry" service:
 * - fetches list from backend
 * - normalizes fields for UI/runtime
 * - does NOT touch UI directly (state layer should decide what to do with the result)
 */
export const modelsRegistryService = {
  /**
   * @returns {Promise<ModelRegistryItem[]>}
   */
  async fetchRegistry() {
    const res = await fetch(MODELS_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch models (${res.status})`);
    }

    /** @type {any[]} */
    const raw = await res.json();
    const list = Array.isArray(raw) ? raw : [];

    return list.map(normalizeModel).filter(Boolean);
  },

  /**
   * Compare two registries in a stable, order-independent way.
   * @param {ModelRegistryItem[]} a
   * @param {ModelRegistryItem[]} b
   */
  registryEquals(a, b) {
    return stableRegistryKey(a) === stableRegistryKey(b);
  },

  /**
   * Derive default statuses for a registry fetched from backend.
   * For now: everything returned by the server is considered "ok".
   * @param {ModelRegistryItem[]} registry
   * @returns {Record<string, ModelStatus>}
   */
  buildStatuses(registry) {
    /** @type {Record<string, ModelStatus>} */
    const out = {};
    for (const m of registry) {
      out[String(m.id)] = 'ok';
    }
    return out;
  },
};

/** @param {any} m */
function normalizeModel(m) {
  if (!m) return null;

  const id = m.id;
  const title = m.title ?? m.modelName ?? m.label ?? `model-${String(id)}`;
  const modelName = m.modelName ?? m.runtimeId ?? m.model ?? undefined;

  return {
    id,
    title,
    modelName,
    runtimeId: modelName,
    provider: guessProvider(modelName),
  };
}

/** @param {string=} modelName */
function guessProvider(modelName) {
  const s = String(modelName ?? '').toLowerCase();
  if (!s) return undefined;
  if (s.includes('gemini')) return 'gemini';
  // naive, but better than nothing
  return 'ollama';
}

function stableRegistryKey(registry) {
  const rows = (Array.isArray(registry) ? registry : [])
    .map((m) => ({
      id: String(m.id),
      title: String(m.title ?? ''),
      modelName: String(m.modelName ?? m.runtimeId ?? ''),
      provider: String(m.provider ?? ''),
    }))
    .sort((x, y) => x.id.localeCompare(y.id));

  return JSON.stringify(rows);
}
