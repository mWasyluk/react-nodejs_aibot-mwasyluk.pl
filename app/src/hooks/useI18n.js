import { useMemo } from 'react';
import { useAppState } from '../context/AppStateContext';
import { createT } from '../loc/i18n';

/**
 * i18n hook: returns a translator bound to current UI language.
 *
 * Usage:
 * const { t } = useI18n();
 * <Tooltip title={t.topbarThemeTooltip} />
 */
export function useI18n() {
  const { state } = useAppState();
  const lang = state.ui.language;

  const t = useMemo(() => createT(lang), [lang]);

  return { t, lang };
}
