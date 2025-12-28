import { isValidModelId } from '../utils/model-util';

/** @param {import('./types').AppState} state */
export const selectUi = (state) => state.ui;

/** @param {import('./types').AppState} state */
export const selectCurrentChatId = (state) => state.chats.currentChatId;

/** @param {import('./types').AppState} state */
export const selectCurrentChat = (state) => {
    const id = state.chats.currentChatId;
    if (!id) return null;
    return state.chats.byId[id] ?? null;
};

/** @param {import('./types').AppState} state */
export const selectChatsList = (state) => {
    return state.chats.allIds
        .map((id) => state.chats.byId[id])
        .filter(Boolean);
};

/** @param {import('./types').AppState} state */
export const selectMessagesForChat = (state, chatId) => {
    if (!chatId) return [];
    return state.messages.byChatId[chatId] ?? [];
};

/** @param {import('./types').AppState} state */
export const selectMessagesForCurrentChat = (state) => {
    const chatId = state.chats.currentChatId;
    return selectMessagesForChat(state, chatId);
};

/** @param {import('./types').AppState} state */
export const selectModelsRegistry = (state) => state.models.registry;

/** @param {import('./types').AppState} state */
export const selectSelectedModel = (state) => {
    const id = state.models.selectedModelId;
    if (!isValidModelId(id)) return null;
    return state.models.registry.find((m) => parseInt(m.id) === parseInt(id)) ?? null;
};

/** @param {import('./types').AppState} state */
export const selectModelStatus = (state, modelId) => {
    if (!isValidModelId(modelId)) return 'missing';
    return state.models.statusesById[modelId] ?? 'missing';
};
