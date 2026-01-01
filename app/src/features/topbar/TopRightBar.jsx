import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Settings, LightMode, DarkMode } from '@mui/icons-material';
import { IconButton, Tooltip, ClickAwayListener } from '@mui/material';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import { LANGUAGE, THEME } from '../../state/constants';

/* ============ STYLED COMPONENTS ============ */

const Wrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  z-index: 999;
`;

const SettingsButton = styled(IconButton)`
  && {
    transition: all 0.1s ease-in-out;
    width: 44px;
    height: 44px;
    background: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    
    &:hover {
      background: ${({ theme }) => theme.palette.primary.dark || theme.palette.primary.main};
      filter: brightness(1.1);
    }
    
    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 200px;
  border-radius: 16px;
  z-index: 1000;
  padding: 0 10px;
  background: ${({ theme }) => theme.palette.primary.main};
  
  /* Triangle pointer */
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 16px;
    width: 12px;
    height: 12px;
    transform: rotate(45deg);
    background: ${({ theme }) => theme.palette.primary.main};
  }
`;

const MenuRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }
`;

const MenuLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;

const OptionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const OptionButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  background: ${({ theme, $active }) =>
    $active ? theme.palette.primary.light : theme.palette.primary.main};
  color: ${({ theme, $active }) =>
    $active
      ? theme.palette.primary.contrastText
      : (theme.palette.primary.contrastTextInactive || 'rgba(255,255,255,0.5)')};
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const FlagButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 4px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  overflow: hidden;
  background: ${({ theme, $active }) =>
    $active ? theme.palette.primary.light : theme.palette.primary.main};
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  /* Grayscale inactive flags */
  svg {
    border-radius: 4px;
    filter: ${({ $active }) => $active ? 'none' : 'grayscale(1)'};
    transition: filter 0.15s ease;
  }
  
  &:hover svg {
    filter: none;
  }
`;

/* ============ FLAG COMPONENTS ============ */

const PLFlag = () => (
  <svg viewBox="0 0 24 16" width="24" height="16">
    <rect width="24" height="8" fill="#FFFFFF" />
    <rect y="8" width="24" height="8" fill="#DC143C" />
  </svg>
);

const UKFlag = () => (
  <svg viewBox="0 0 60 30" width="24" height="16">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

/* ============ COMPONENT ============ */

/**
 * TopRightBar - Przycisk ustawień z rozwijalnym menu.
 * Menu zawiera przełączniki motywu (jasny/ciemny) i języka (PL/EN).
 */
export default function TopRightBar() {
  const { state, actions } = useAppState();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null);

  const currentTheme = state.ui.theme;
  const currentLanguage = state.ui.language;

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const setTheme = useCallback((theme) => {
    actions.setTheme(theme);
  }, [actions]);

  const setLanguage = useCallback((lang) => {
    actions.setLanguage(lang);
  }, [actions]);

  // Close menu on escape
  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen, closeMenu]);

  return (
    <ClickAwayListener onClickAway={closeMenu}>
      <Wrap>
        <Tooltip disableInteractive title={t.topbarSettingsTooltip || 'Ustawienia'}>
          <SettingsButton
            ref={buttonRef}
            onClick={toggleMenu}
            aria-label={t.topbarSettingsTooltip || 'Settings'}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <Settings />
          </SettingsButton>
        </Tooltip>

        {menuOpen && (
          <DropdownMenu role="menu">
            {/* Theme row */}
            <MenuRow>
              <MenuLabel>{t.settingsTheme || 'Motyw'}</MenuLabel>
              <OptionsGroup>
                <Tooltip disableInteractive title={t.settingsThemeLight || 'Jasny'}>
                  <OptionButton
                    $active={currentTheme === THEME.LIGHT}
                    onClick={() => setTheme(THEME.LIGHT)}
                    aria-label={t.settingsThemeLight || 'Light theme'}
                    type="button"
                  >
                    <LightMode />
                  </OptionButton>
                </Tooltip>
                <Tooltip disableInteractive title={t.settingsThemeDark || 'Ciemny'}>
                  <OptionButton
                    $active={currentTheme === THEME.DARK}
                    onClick={() => setTheme(THEME.DARK)}
                    aria-label={t.settingsThemeDark || 'Dark theme'}
                    type="button"
                  >
                    <DarkMode />
                  </OptionButton>
                </Tooltip>
              </OptionsGroup>
            </MenuRow>

            {/* Language row */}
            <MenuRow>
              <MenuLabel>{t.settingsLanguage || 'Język'}</MenuLabel>
              <OptionsGroup>
                <Tooltip disableInteractive title="Polski">
                  <FlagButton
                    $active={currentLanguage === LANGUAGE.PL}
                    onClick={() => setLanguage(LANGUAGE.PL)}
                    aria-label="Polski"
                    type="button"
                  >
                    <PLFlag />
                  </FlagButton>
                </Tooltip>
                <Tooltip disableInteractive title="English">
                  <FlagButton
                    $active={currentLanguage === LANGUAGE.EN}
                    onClick={() => setLanguage(LANGUAGE.EN)}
                    aria-label="English"
                    type="button"
                  >
                    <UKFlag />
                  </FlagButton>
                </Tooltip>
              </OptionsGroup>
            </MenuRow>
          </DropdownMenu>
        )}
      </Wrap>
    </ClickAwayListener>
  );
}