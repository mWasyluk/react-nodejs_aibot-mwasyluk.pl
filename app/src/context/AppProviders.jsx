import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { AppStateProvider, useAppState } from './AppStateContext';
import { darkTheme, lightTheme } from '../theme';

// Zakładam, że masz LLMContext. Jeśli nazwa provider’a jest inna, podmień.
import { LLMProvider } from '../context/LLMContext';
import { THEME } from '../state/constants';

function ThemeBridge({ children }) {
    const { state } = useAppState();

    const themeObject = useMemo(() => {
        return state.ui.theme === THEME.DARK ? darkTheme : lightTheme;
    }, [state.ui.theme]);

    return <ThemeProvider theme={themeObject}>{children}</ThemeProvider>;
}

export default function AppProviders({ children }) {
    return (
        <AppStateProvider>
            <ThemeBridge>
                <LLMProvider apiBaseUrl="/api">
                    {children}
                </LLMProvider>
            </ThemeBridge>
        </AppStateProvider>
    );
}
