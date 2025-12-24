import { en } from './translations.en';
import { pl } from './translations.pl';

/**
 * @typedef {typeof en} I18nDict
 * @typedef {keyof I18nDict} I18nKey
 *
 * A callable translator that also exposes each key as a property for VSCode autocomplete:
 * - t('topbarThemeTooltip')
 * - t.topbarThemeTooltip
 *
 * @typedef {((key: I18nKey) => string) & I18nDict} I18nT
 */

/** @type {Record<string, I18nDict>} */
export const dictionaries = Object.freeze({
  en,
  pl,
});

/**
 * Create a translator for a given language code.
 *
 * Fallback order:
 * 1) selected language
 * 2) English
 * 3) the key itself (so missing keys are obvious)
 *
 * @param {'en'|'pl'} language
 * @returns {I18nT}
 */
export function createT(language) {
  /** @type {I18nDict} */
  const dict = dictionaries[language] || en;

  /** @type {I18nT} */
  const t = ((key) => {
    const fromLang = dict[key];
    if (typeof fromLang === 'string') return fromLang;
    const fromEn = en[key];
    if (typeof fromEn === 'string') return fromEn;
    return String(key);
  });

  // Expose t.someKey getters so you get autocomplete and easy usage.
  // Keys come from EN (source of truth).
  for (const key of Object.keys(en)) {
    Object.defineProperty(t, key, {
      enumerable: true,
      configurable: false,
      get: () => t(key),
    });
  }

  return t;
}
