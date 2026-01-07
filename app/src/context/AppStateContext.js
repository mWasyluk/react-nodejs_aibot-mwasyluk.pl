import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import * as rawActions from '../state/actions';
import { initialState } from '../state/initialState';
import * as selectors from '../state/selectors';
import { createLocalStorageAdapter } from '../state/storage';

/**
 * @typedef {import('../state/types').AppState} AppState
 *
 * @typedef {Object} AppActions
 * @property {(theme: AppState['ui']['theme']) => void} setTheme
 * @property {(lang: AppState['ui']['language']) => void} setLanguage
 * @property {(open: boolean) => void} setSideMenuOpen
 *
 * @property {(registry: AppState['models']['registry']) => void} setModelsRegistry
 * @property {(id: string|null) => void} setSelectedModelId
 * @property {(modelId: string|number, status: import('../state/types').ModelStatus) => void} setModelStatus
 * @property {(statusesById: Object.<string, import('../state/types').ModelStatus>, opts?: {merge?: boolean}) => void} setModelsStatusesById
 *
 * @property {(opts?: {title?: string}) => string} createChat
 * @property {(id: string) => void} setCurrentChat
 * @property {(chatId: string, archived?: boolean) => void} archiveChat
 * @property {(chatId: string) => void} deleteChat
 * @property {(chatId: string, title: string) => void} setChatTitle
 * @property {(chatId: string, text: string) => (string|null)} addUserMessage
 * @property {(chatId: string, payload: any) => (string|null)} upsertAssistantMessage
 * @property {(chatId: string, meta: any) => (string|null)} startAssistantMessage
 *
 * @typedef {Object} AppSelectors
 * @property {(state: AppState) => AppState['ui']} selectUi
 * @property {(state: AppState) => any} selectCurrentChat
 * @property {(state: AppState) => any[]} selectChatsList
 * @property {(state: AppState) => any[]} selectMessagesForCurrentChat
 * @property {(state: AppState) => any[]} selectModelsRegistry
 * @property {(state: AppState) => any} selectSelectedModel
 *
 * @typedef {Object} AppStateContextValue
 * @property {AppState} state
 * @property {AppActions} actions
 * @property {typeof selectors} selectors
 */

/** @type {React.Context<AppStateContextValue | null>} */
const AppStateContext = createContext(null);

function shallowEqual(a, b) {
    if (Object.is(a, b)) return true;
    if (!a || !b) return false;
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!Object.is(a[k], b[k])) return false;
    return true;
}

export function AppStateProvider({ children, storageKey = 'aibot_app_state_v1' }) {
    const storage = useMemo(() => createLocalStorageAdapter(storageKey), [storageKey]);
    const stateRef = useRef(null);

    /** @type {[AppState, React.Dispatch<React.SetStateAction<AppState>>]} */
    const [state, _setState] = useState(() => {
        const loaded = storage.load();
        const initial = loaded ? mergeWithDefaults(loaded) : initialState;
        stateRef.current = initial;
        return initial;
    });

    /** @returns {AppState} */
    const getState = () => stateRef.current;

    /** @param {AppState | ((prev: AppState) => AppState)} next */
    const setState = useCallback((next) => {
        _setState((prev) => {
            const resolved = typeof next === 'function' ? next(prev) : next;
            if (shallowEqual(prev, resolved)) return prev;
            stateRef.current = resolved;
            storage.save(resolved);
            return resolved;
        });
    }, [storage]);

    /** @type {AppActions} */
    const actions = useMemo(() => {
        return {
            setTheme: (theme) => rawActions.setTheme(getState(), setState, theme),
            setLanguage: (lang) => rawActions.setLanguage(getState(), setState, lang),
            setSideMenuOpen: (open) => rawActions.setSideMenuOpen(getState(), setState, open),

            setModelsRegistry: (registry) => rawActions.setModelsRegistry(getState(), setState, registry),
            setSelectedModelId: (id) => rawActions.setSelectedModelId(getState(), setState, id),
            setModelStatus: (modelId, status) => rawActions.setModelStatus(getState(), setState, modelId, status),
            setModelsStatusesById: (statusesById, opts) => rawActions.setModelsStatusesById(getState(), setState, statusesById, opts),

            createChat: (opts) => rawActions.createChat(getState(), setState, opts),
            setCurrentChat: (id) => rawActions.setCurrentChat(getState(), setState, id),
            archiveChat: (chatId, archived) => rawActions.archiveChat(getState(), setState, chatId, archived),
            deleteChat: (chatId) => rawActions.deleteChat(getState(), setState, chatId),
            setChatTitle: (chatId, title) => rawActions.setChatTitle(getState(), setState, chatId, title),
            addUserMessage: (chatId, text) => rawActions.addUserMessage(getState(), setState, chatId, text),
            addNotification: (chatId, type, message) =>
                rawActions.addNotification(getState(), setState, chatId, type, message),
            startAssistantMessage: (chatId, meta) =>
                rawActions.startAssistantMessage(getState(), setState, chatId, meta),
            appendAssistantDelta: (chatId, messageId, delta) =>
                rawActions.appendAssistantDelta(getState(), setState, chatId, messageId, delta),
            appendAssistantThinkingDelta: (chatId, messageId, delta) =>
                rawActions.appendAssistantThinkingDelta(getState(), setState, chatId, messageId, delta),
            finalizeAssistantMessage: (chatId, messageId) =>
                rawActions.finalizeAssistantMessage(getState(), setState, chatId, messageId),
            cancelAssistantMessage: (chatId, messageId) =>
                rawActions.cancelAssistantMessage(getState(), setState, chatId, messageId),
            errorAssistantMessage: (chatId, messageId) =>
                rawActions.errorAssistantMessage(getState(), setState, chatId, messageId),

            upsertAssistantMessage: (chatId, payload) =>
                rawActions.upsertAssistantMessage(getState(), setState, chatId, payload),
        };
    }, [setState]);

    /** @type {AppStateContextValue} */
    const value = useMemo(() => ({ state, actions, selectors }), [state, actions]);

    return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

/** @returns {AppStateContextValue} */
export function useAppState() {
    const ctx = useContext(AppStateContext);
    if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
    return ctx;
}

function mergeWithDefaults(loaded) {
    return {
        ...initialState,
        ...loaded,
        ui: { ...initialState.ui, ...(loaded.ui || {}) },
        chats: { ...initialState.chats, ...(loaded.chats || {}) },
        messages: { ...initialState.messages, ...(loaded.messages || {}) },
        models: { ...initialState.models, ...(loaded.models || {}) },
    };
}
