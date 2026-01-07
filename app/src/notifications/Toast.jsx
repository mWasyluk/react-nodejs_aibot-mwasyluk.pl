import { CheckCircleOutline, Close, ErrorOutline, InfoOutlined, WarningAmberOutlined } from '@mui/icons-material';
import { IconButton, Snackbar } from '@mui/material';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

/* ============ STYLED COMPONENTS ============ */

const ToastContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 300px;
  max-width: 480px;
  padding: 14px 16px;
  border-radius: 12px;
  
  ${({ theme, $type }) => {
    const colors = getToastColors(theme, $type);

    return css`
      background: ${colors.background};
      border: 1px solid ${colors.border};
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;
  }}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  
  ${({ theme, $type }) => {
    const colors = getToastColors(theme, $type);

    return css`
      color: ${colors.icon};
      
      svg {
        width: 22px;
        height: 22px;
      }
    `;
  }}
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToastTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  
  ${({ theme }) => css`
    color: ${theme.palette.text.main};
  `}
`;

const ToastMessage = styled.div`
  font-size: 13px;
  line-height: 1.5;
  
  ${({ theme }) => css`
    color: ${theme.palette.text.secondary};
  `}
`;

const CloseButton = styled(IconButton)`
  && {
    padding: 4px;
    margin: -4px -6px -4px 4px;
    flex-shrink: 0;
    
    ${({ theme }) => css`
      color: ${theme.palette.text.secondary};
      
      &:hover {
        background: ${theme.palette.border};
      }
    `}
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

/* ============ HELPERS ============ */

function getToastColors(theme, type) {
  switch (type) {
    case 'success':
      return {
        background: theme.palette.surface,
        border: theme.palette.success.main,
        icon: theme.palette.success.main,
      };
    case 'warning':
      return {
        background: theme.palette.surface,
        border: theme.palette.warning.main,
        icon: theme.palette.warning.main,
      };
    case 'error':
      return {
        background: theme.palette.surface,
        border: theme.palette.error.main,
        icon: theme.palette.error.main,
      };
    case 'info':
    default:
      return {
        background: theme.palette.surface,
        border: theme.palette.primary.main,
        icon: theme.palette.primary.main,
      };
  }
}

function getToastIcon(type) {
  switch (type) {
    case 'success':
      return <CheckCircleOutline />;
    case 'warning':
      return <WarningAmberOutlined />;
    case 'error':
      return <ErrorOutline />;
    case 'info':
    default:
      return <InfoOutlined />;
  }
}

/* ============ CONTEXT ============ */

/**
 * @typedef {Object} ToastConfig
 * @property {'info'|'success'|'warning'|'error'} [type='info']
 * @property {string} [title]
 * @property {string} message
 * @property {number} [duration=5000] - Auto-hide duration in ms (0 = no auto-hide)
 */

/**
 * @typedef {Object} ToastContextValue
 * @property {(config: ToastConfig) => void} showToast
 * @property {() => void} hideToast
 * @property {(message: string, title?: string) => void} showError
 * @property {(message: string, title?: string) => void} showSuccess
 * @property {(message: string, title?: string) => void} showWarning
 * @property {(message: string, title?: string) => void} showInfo
 */

/** @type {React.Context<ToastContextValue | null>} */
const ToastContext = createContext(null);

/* ============ PROVIDER ============ */

/**
 * ToastProvider - Wrapper component that provides toast functionality to the app.
 * 
 * @example
 * // In your AppProviders:
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * 
 * // In any component:
 * const { showError } = useToast();
 * showError('Stream przerwany', 'Błąd połączenia');
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    type: 'info',
    title: '',
    message: '',
    duration: 5000,
  });

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  const showToast = useCallback((config) => {
    setToast({
      open: true,
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      duration: config.duration !== undefined ? config.duration : 5000,
    });
  }, []);

  const showError = useCallback((message, title) => {
    showToast({ type: 'error', message, title });
  }, [showToast]);

  const showSuccess = useCallback((message, title) => {
    showToast({ type: 'success', message, title });
  }, [showToast]);

  const showWarning = useCallback((message, title) => {
    showToast({ type: 'warning', message, title });
  }, [showToast]);

  const showInfo = useCallback((message, title) => {
    showToast({ type: 'info', message, title });
  }, [showToast]);

  const contextValue = useMemo(() => ({
    showToast,
    hideToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  }), [showToast, hideToast, showError, showSuccess, showWarning, showInfo]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration || null}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ maxWidth: 'none' }}
      >
        <ToastContainer $type={toast.type}>
          <IconWrapper $type={toast.type}>
            {getToastIcon(toast.type)}
          </IconWrapper>

          <ContentWrapper>
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            <ToastMessage>{toast.message}</ToastMessage>
          </ContentWrapper>

          <CloseButton onClick={hideToast} aria-label="Close notification">
            <Close />
          </CloseButton>
        </ToastContainer>
      </Snackbar>
    </ToastContext.Provider>
  );
}

/* ============ HOOK ============ */

/**
 * Hook do wyświetlania powiadomień toast.
 * 
 * @returns {ToastContextValue}
 * 
 * @example
 * const { showError, showSuccess, showToast } = useToast();
 * 
 * // Proste użycie:
 * showError('Nie udało się zapisać');
 * showSuccess('Zapisano pomyślnie');
 * 
 * // Z tytułem:
 * showError('Stream przerwany', 'Błąd połączenia');
 * 
 * // Pełna konfiguracja:
 * showToast({
 *   type: 'warning',
 *   title: 'Uwaga',
 *   message: 'Model może nie działać poprawnie',
 *   duration: 8000,
 * });
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}

/* ============ STANDALONE COMPONENT ============ */

/**
 * Toast - Standalone toast component (if you prefer not to use context).
 * 
 * @param {Object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @param {'info'|'success'|'warning'|'error'} [props.type='info']
 * @param {string} [props.title]
 * @param {string} props.message
 * @param {number} [props.duration=5000]
 */
export function Toast({
  open,
  onClose,
  type = 'info',
  title,
  message,
  duration = 5000,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration || null}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ maxWidth: 'none' }}
    >
      <ToastContainer $type={type}>
        <IconWrapper $type={type}>
          {getToastIcon(type)}
        </IconWrapper>

        <ContentWrapper>
          {title && <ToastTitle>{title}</ToastTitle>}
          <ToastMessage>{message}</ToastMessage>
        </ContentWrapper>

        <CloseButton onClick={onClose} aria-label="Close notification">
          <Close />
        </CloseButton>
      </ToastContainer>
    </Snackbar>
  );
}

export default Toast;