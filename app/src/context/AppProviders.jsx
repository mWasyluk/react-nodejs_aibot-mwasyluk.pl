import { useEffect, useMemo, useRef } from 'react';
import { ThemeProvider } from 'styled-components';
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
                // No chat? Nowhere to put a notification. Just log and let the UI show what it can.
                console.error('[ModelsBootstrapper] ', e);

                // If we have *no* models at all, reflect it in statuses (selector can display red).
                // if (!state.models.registry?.length) {
                actions.setModelsStatusesById({}, { merge: false });
                // }
            }
        })();
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
