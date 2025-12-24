import React from 'react';
import styled from 'styled-components';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode, Translate, Settings } from '@mui/icons-material';
import { useTheme } from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import { LANGUAGE, THEME } from '../../state/constants';
import { useI18n } from '../../hooks/useI18n';

const Wrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export default function TopRightBar() {
  const theme = useTheme();
  const { state, actions } = useAppState();
  const { t } = useI18n();

  const toggleTheme = () =>
    actions.setTheme(state.ui.theme === THEME.DARK ? THEME.LIGHT : THEME.DARK);

  const toggleLang = () =>
    actions.setLanguage(state.ui.language === LANGUAGE.PL ? LANGUAGE.EN : LANGUAGE.PL);

  return (
    <Wrap>
      <Tooltip title={t.topbarThemeTooltip}>
        <IconButton onClick={toggleTheme} sx={{ color: theme.colors.text.primary }}>
          {state.ui.theme === THEME.DARK ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Tooltip>

      <Tooltip title={`${t.topbarLanguageTooltip}: ${state.ui.language.toUpperCase()}`}>
        <IconButton onClick={toggleLang} sx={{ color: theme.colors.text.primary }}>
          <Translate />
        </IconButton>
      </Tooltip>

      <Tooltip title={t.topbarSettingsTooltip}>
        <span>
          <IconButton disabled sx={{ color: theme.colors.text.primary }}>
            <Settings />
          </IconButton>
        </span>
      </Tooltip>
    </Wrap>
  );
}
