import React, { useState, useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

/* ============ STYLED COMPONENTS ============ */

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 16px;
    min-width: 360px;
    max-width: 480px;
    
    ${({ theme }) => css`
      background: ${theme.colors.surface};
      border: 1px solid ${theme.colors.border};
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
    `}
  }
  
  & .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 12px;
    font-size: 16px;
    font-weight: 700;
    
    ${({ theme }) => css`
      color: ${theme.colors.text.primary};
      border-bottom: 1px solid ${theme.colors.border};
    `}
  }
`;

const CloseButton = styled(IconButton)`
  && {
    padding: 6px;
    margin: -6px -8px -6px 8px;
    
    ${({ theme }) => css`
      color: ${theme.colors.text.secondary};
      
      &:hover {
        background: ${theme.colors.border};
      }
    `}
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const StyledDialogContent = styled(DialogContent)`
  && {
    padding: 20px;
    
    ${({ theme }) => css`
      color: ${theme.colors.text.primary};
    `}
  }
`;

const StyledDialogActions = styled(DialogActions)`
  && {
    padding: 12px 20px 16px;
    gap: 8px;
    
    ${({ theme }) => css`
      border-top: 1px solid ${theme.colors.border};
    `}
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InputLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  
  ${({ theme }) => css`
    color: ${theme.colors.text.secondary};
  `}
`;

const StyledInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: all 0.15s ease;
  
  ${({ theme, $hasError }) => css`
    background: ${theme.colors.background};
    border: 1px solid ${$hasError ? theme.colors.error.default : theme.colors.border};
    color: ${theme.colors.text.primary};
    
    &:focus {
      border-color: ${$hasError ? theme.colors.error.default : theme.colors.primary};
      box-shadow: 0 0 0 3px ${$hasError ? theme.colors.error.default + '22' : theme.colors.primary + '22'};
    }
    
    &::placeholder {
      color: ${theme.colors.text.secondary};
      opacity: 0.6;
    }
  `}
`;

const ErrorText = styled.div`
  font-size: 12px;
  min-height: 18px;
  
  ${({ theme }) => css`
    color: ${theme.colors.error.default};
  `}
`;

const DialogButton = styled.button`
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  
  ${({ theme, $variant }) => {
    if ($variant === 'primary') {
      return css`
        background: ${theme.colors.primary};
        color: #FFFFFF;
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primary}dd;
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `;
    }
    
    // secondary / cancel
    return css`
      background: transparent;
      border-color: ${theme.colors.border};
      color: ${theme.colors.text.primary};
      
      &:hover {
        background: ${theme.colors.background};
        border-color: ${theme.colors.text.secondary};
      }
    `;
  }}
`;

const ContentText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  
  ${({ theme }) => css`
    color: ${theme.colors.text.primary};
  `}
`;

/* ============ COMPONENT ============ */

/**
 * AppDialog - Uniwersalny komponent dialogu w stylistyce aplikacji.
 * 
 * Wspiera dwa główne tryby:
 * 1. Input dialog (type="input") - z polem tekstowym i walidacją inline
 * 2. Confirm dialog (type="confirm") - prosty dialog potwierdzenia
 * 3. Alert dialog (type="alert") - informacyjny, tylko zamknięcie
 * 
 * @param {Object} props
 * @param {boolean} props.open - Czy dialog jest otwarty
 * @param {function} props.onClose - Callback zamknięcia
 * @param {string} props.title - Tytuł dialogu
 * @param {'input'|'confirm'|'alert'} [props.type='confirm'] - Typ dialogu
 * @param {string} [props.message] - Treść wiadomości (dla confirm/alert)
 * @param {string} [props.inputLabel] - Etykieta pola input
 * @param {string} [props.inputValue] - Wartość początkowa input
 * @param {string} [props.inputPlaceholder] - Placeholder dla input
 * @param {function} [props.onConfirm] - Callback potwierdzenia (dla input zwraca wartość)
 * @param {function} [props.validate] - Funkcja walidacji: (value) => string | null
 * @param {string} [props.confirmText='OK'] - Tekst przycisku potwierdzenia
 * @param {string} [props.cancelText='Anuluj'] - Tekst przycisku anulowania
 * @param {boolean} [props.showCancel=true] - Czy pokazać przycisk anulowania
 */
export default function AppDialog({
  open,
  onClose,
  title,
  type = 'confirm',
  message,
  inputLabel,
  inputValue: initialInputValue = '',
  inputPlaceholder,
  onConfirm,
  validate,
  confirmText = 'OK',
  cancelText = 'Anuluj',
  showCancel = true,
}) {
  const [inputValue, setInputValue] = useState(initialInputValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setInputValue(initialInputValue);
      setError('');
      setTouched(false);
    }
  }, [open, initialInputValue]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (touched && validate) {
      const validationError = validate(value);
      setError(validationError || '');
    }
  }, [touched, validate]);

  const handleInputBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      const validationError = validate(inputValue);
      setError(validationError || '');
    }
  }, [inputValue, validate]);

  const handleConfirm = useCallback(() => {
    if (type === 'input') {
      // Validate before confirm
      if (validate) {
        const validationError = validate(inputValue);
        if (validationError) {
          setError(validationError);
          setTouched(true);
          return;
        }
      }
      onConfirm?.(inputValue);
    } else {
      onConfirm?.();
    }
    onClose();
  }, [type, inputValue, validate, onConfirm, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && type === 'input') {
      e.preventDefault();
      handleConfirm();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  }, [type, handleConfirm, onClose]);

  const hasError = Boolean(error);
  const isConfirmDisabled = type === 'input' && hasError;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      aria-labelledby="app-dialog-title"
    >
      <StyledDialogTitle id="app-dialog-title">
        {title}
        <CloseButton onClick={onClose} aria-label="Close">
          <Close />
        </CloseButton>
      </StyledDialogTitle>
      
      <StyledDialogContent>
        {type === 'input' ? (
          <InputWrapper>
            {inputLabel && <InputLabel>{inputLabel}</InputLabel>}
            <StyledInput
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={inputPlaceholder}
              $hasError={hasError}
              autoFocus
            />
            <ErrorText>{error}</ErrorText>
          </InputWrapper>
        ) : (
          <ContentText>{message}</ContentText>
        )}
      </StyledDialogContent>
      
      <StyledDialogActions>
        {showCancel && type !== 'alert' && (
          <DialogButton $variant="secondary" onClick={onClose}>
            {cancelText}
          </DialogButton>
        )}
        <DialogButton
          $variant="primary"
          onClick={handleConfirm}
          disabled={isConfirmDisabled}
        >
          {confirmText}
        </DialogButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}

/**
 * Hook do łatwego zarządzania stanem dialogu.
 * 
 * @example
 * const { dialogProps, openDialog, closeDialog } = useAppDialog();
 * 
 * openDialog({
 *   title: 'Zmień tytuł',
 *   type: 'input',
 *   inputValue: currentTitle,
 *   onConfirm: (newTitle) => { ... }
 * });
 * 
 * <AppDialog {...dialogProps} />
 */
export function useAppDialog() {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    type: 'confirm',
    message: '',
    inputLabel: '',
    inputValue: '',
    inputPlaceholder: '',
    validate: null,
    onConfirm: null,
    confirmText: 'OK',
    cancelText: 'Anuluj',
    showCancel: true,
  });

  const openDialog = useCallback((config) => {
    setDialogState({
      open: true,
      title: config.title || '',
      type: config.type || 'confirm',
      message: config.message || '',
      inputLabel: config.inputLabel || '',
      inputValue: config.inputValue || '',
      inputPlaceholder: config.inputPlaceholder || '',
      validate: config.validate || null,
      onConfirm: config.onConfirm || null,
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Anuluj',
      showCancel: config.showCancel !== false,
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    dialogProps: {
      ...dialogState,
      onClose: closeDialog,
    },
    openDialog,
    closeDialog,
    isOpen: dialogState.open,
  };
}
