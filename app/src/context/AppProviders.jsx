import { useEffect, useMemo, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
import { ToastProvider, useToast } from '../notifications/Toast';
import { modelsRegistryService } from '../services/modelsRegistryService';
import { THEME } from '../state/constants';
import { darkTheme, lightTheme } from '../theme';
import { AppStateProvider, useAppState } from './AppStateContext';

function ThemeBridge({ children }) {
    const { state } = useAppState();

    const themeObject = useMemo(() => {
        return state.ui.theme === THEME.DARK ? darkTheme : lightTheme;
    }, [state.ui.theme]);

    return <ThemeProvider theme={themeObject}>{children}</ThemeProvider>;
}

function ModelsBootstrapper() {
    const { state, actions } = useAppState();
    const { showError } = useToast();
    const singleRef = useRef(false);

    useEffect(() => {
        if (singleRef.current) return;
        singleRef.current = true;

        (async () => {
            try {
                const fetched = await modelsRegistryService.fetchRegistry();

                // Always (re)build statuses based on what the server currently returns.
                const statusesFromServer = modelsRegistryService.buildStatuses(fetched);

                // Update registry only if it actually changed.
                const changed = !modelsRegistryService.registryEquals(state.models.registry, fetched);

                if (changed) {
                    actions.setModelsRegistry(fetched);
                }

                // Even if registry didn't change, we still want statuses ASAP to reflect reality
                // (e.g. previous "error" persisted locally should be corrected).
                actions.setModelsStatusesById(statusesFromServer, { merge: true });
            } catch (e) {
                console.error('[ModelsBootstrapper] ', e);

                // Show toast notification for model fetch error
                showError(
                    e?.message || 'Failed to fetch models from server',
                    'Model Registry Error'
                );

                // If we have *no* models at all, reflect it in statuses (selector can display red).
                actions.setModelsStatusesById({}, { merge: false });
            }
        })();
    }, [actions, state.models.registry, showError]);

    return null;
}

export default function AppProviders({ children }) {
    return (
        <AppStateProvider>
            <ThemeBridge>
                <ToastProvider>
                    <ModelsBootstrapper />
                    {children}
                </ToastProvider>
            </ThemeBridge>
        </AppStateProvider>
    );
}
