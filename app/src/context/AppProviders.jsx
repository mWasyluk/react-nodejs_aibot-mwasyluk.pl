import React, { useEffect, useMemo, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
import { AppStateProvider, useAppState } from './AppStateContext';
import { darkTheme, lightTheme } from '../theme';
import { THEME } from '../state/constants';
import { MODELS_URL } from '../utils/api-util';

function ThemeBridge({ children }) {
    const { state } = useAppState();

    const themeObject = useMemo(() => {
        return state.ui.theme === THEME.DARK ? darkTheme : lightTheme;
    }, [state.ui.theme]);

    return <ThemeProvider theme={themeObject}>{children}</ThemeProvider>;
}

function ModelsBootstrapper() {
    const { state, actions } = useAppState();
    const signleRef = useRef();

    useEffect(() => {
        // let cancelled = false;

        // // If we already have models loaded (e.g. from localStorage), don’t spam the API.
        // if (state.models.registry?.length) return;

        if (signleRef.current) {
            return;
        }

        signleRef.current = true;

        (async () => {
            try {
                const res = await fetch(MODELS_URL);
                if (!res.ok) throw new Error(`Failed to fetch models (${res.status})`);

                /** @type {any[]} */
                const raw = await res.json();

                // Backend returns models with shape: { id:number, title:string, modelName:string, ... }
                // We keep `id` as number (backend matches strictly), and store `title` for UI.
                const registry = (Array.isArray(raw) ? raw : []).map((m) => ({
                    id: m.id,
                    title: m.title ?? m.modelName ?? `model-${m.id}`,
                    modelName: m.modelName,
                }));

                // if (!cancelled) {
                actions.setModelsRegistry(registry);
                // actions.setSelectedModelId(0);
                // };
            } catch (e) {
                // No chat? Nowhere to put a notification. Just log and let the UI show "No model".
                console.error('[ModelsBootstrapper] ', e);
            }
        })();

        // return () => {
        //     signleRef.current = true;
        // };
    }, [actions, state.models.registry]);

    return null;
}

export default function AppProviders({ children }) {
    return (
        <AppStateProvider>
            <ThemeBridge>
                <ModelsBootstrapper />
                {children}
            </ThemeBridge>
        </AppStateProvider>
    );
}
