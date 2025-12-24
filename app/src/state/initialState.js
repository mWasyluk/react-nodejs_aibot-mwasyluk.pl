import { LANGUAGE, THEME } from './constants';

/** @type {import('./types').AppState} */
export const initialState = {
    ui: {
        theme: THEME.LIGHT, // TODO: should be auto, same for language setting
        language: LANGUAGE.PL,
        sideMenuOpen: true,
    },
    chats: {
        byId: {},
        allIds: [],
        currentChatId: null,
    },
    messages: {
        byChatId: {},
    },
    models: {
        registry: [],
        selectedModelId: null,
        statusesById: {},
    },
};
