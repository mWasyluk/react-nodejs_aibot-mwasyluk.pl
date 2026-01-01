import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ExpandMore } from '@mui/icons-material';
import MemoryIcon from '@mui/icons-material/Memory';
import { ClickAwayListener, Tooltip } from '@mui/material';
import styled, { css } from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';

/* ============ STYLED COMPONENTS ============ */

const Wrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SelectorButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 48px;
  width: 300px;
  padding: 0 16px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${({ theme, $hasError }) =>
    $hasError ? theme.palette.error.main : theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};

  &:hover {
    filter: brightness(1.1);
  }

  &:focus {
    outline: none;
  }

  && span {
    max-width: 100%;
    width: 100%;
  }
`;

const ModelName = styled.span`
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 500;
`;

const ChevronIcon = styled(ExpandMore)`
  && {
    width: 20px;
    height: 20px;
    margin-left: -2px;
    margin-right: -4px;
    transition: transform 0.3s ease-in-out;
    transform: ${({ $open }) => $open ? 'rotate(-180deg)' : 'rotate(0)'};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  padding: 5px;
  border-radius: 24px;
  z-index: 1000;
  background: ${({ theme }) => theme.palette.primary.main};

  /* Triangle pointer */
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.palette.primary.main};
  }
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  min-height: 40px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  font-size: 14px;
  color: ${({ theme }) => theme.palette.primary.contrastText};

  ${({ $selected, $disabled }) => css`
    background-color: ${$selected ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};

    &:hover {
      background-color: ${$selected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)'};
    }

    ${$disabled && css`
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    `}
  `}

  &:not(:last-child) {
    margin-bottom: 5px;
  }

  span:first-child {
    width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/* ============ CONSTANTS ============ */

const STATUS_ICON = {
  ok: '🟢',
  error: '🔴',
  missing: '⚫',
  requiresConfig: '🟠',
};

/* ============ COMPONENT ============ */

/**
 * ModelSelector - Przycisk/dropdown do wyboru modelu AI.
 * Zachowanie spójne z TopRightBar - ClickAwayListener zamiast MUI Select.
 */
export default function ModelSelector() {
  const { state, actions, selectors } = useAppState();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef(null);

  const registry = selectors.selectModelsRegistry(state);

  const selectedModel = useMemo(
    () => selectors.selectSelectedModel(state),
    [selectors, state]
  );

  const selectedModelId = selectedModel?.id;
  const selectedModelStatus = selectors.selectModelStatus(state, selectedModelId);

  const hasError = selectedModelStatus === 'error' || selectedModelStatus === 'missing';

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const onSelectModel = useCallback((modelId) => {
    actions.setSelectedModelId(modelId);
    closeMenu();
  }, [actions, closeMenu]);

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen, closeMenu]);

  const displayName = selectedModel
    ? selectedModel.title || selectedModel.name || selectedModel.id
    : t.modelSelectPlaceholder || 'Select model';

  return (
    <ClickAwayListener onClickAway={closeMenu}>
      <Wrap>
        <Tooltip disableInteractive title={t.modelSelectLabel || 'Model'}>
          <SelectorButton
            ref={buttonRef}
            onClick={toggleMenu}
            $hasError={hasError}
            aria-label={t.modelSelectLabel || 'Model'}
            aria-expanded={menuOpen}
            aria-haspopup="listbox"
            type="button"
          >
            <MemoryIcon />
            <ModelName>{displayName}</ModelName>
            <ChevronIcon $open={menuOpen} />
          </SelectorButton>
        </Tooltip>

        {menuOpen && (
          <DropdownMenu role="listbox">
            {registry.map((m) => {
              const status = selectors.selectModelStatus(state, m.id) ?? 'missing';
              const icon = STATUS_ICON[status] ?? '⚫';
              const disabled = status === 'missing' || status === 'requiresConfig';
              const isSelected = m.id === selectedModelId;

              return (
                <Option
                  key={m.id}
                  role="option"
                  aria-selected={isSelected}
                  $selected={isSelected}
                  $disabled={disabled}
                  onClick={() => !disabled && onSelectModel(m.id)}
                  type="button"
                >
                  <span>{icon}</span>
                  <span>{m.title ?? m.name ?? m.id}</span>
                </Option>
              );
            })}
          </DropdownMenu>
        )}
      </Wrap>
    </ClickAwayListener>
  );
}