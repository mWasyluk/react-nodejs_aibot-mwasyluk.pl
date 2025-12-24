import { nanoid } from './id';

const now = () => Date.now();

/**
 * @param {import('./types').AppState} state
 * @param {(next: import('./types').AppState) => void} setState
 */
export function setTheme(state, setState, theme) {
    setState({
        ...state,
        ui: { ...state.ui, theme },
    });
}

export function setLanguage(state, setState, language) {
    setState({
        ...state,
        ui: { ...state.ui, language },
    });
}

export function setSideMenuOpen(state, setState, sideMenuOpen) {
    setState({
        ...state,
        ui: { ...state.ui, sideMenuOpen },
    });
}

export function createChat(state, setState, { title = 'New chat' } = {}) {
    const id = nanoid();
    const ts = now();

    const chat = {
        id,
        title,
        createdAt: ts,
        updatedAt: ts,
        archived: false,
    };

    setState({
        ...state,
        chats: {
            byId: { ...state.chats.byId, [id]: chat },
            allIds: [id, ...state.chats.allIds],
            currentChatId: id,
        },
        messages: {
            ...state.messages,
            byChatId: { ...state.messages.byChatId, [id]: [] },
        },
    });

    return id;
}

export function setCurrentChat(state, setState, chatId) {
    if (!chatId || !state.chats.byId[chatId]) return;

    setState({
        ...state,
        chats: { ...state.chats, currentChatId: chatId },
    });
}

export function archiveChat(state, setState, chatId, archived = true) {
    const chat = state.chats.byId[chatId];
    if (!chat) return;

    setState({
        ...state,
        chats: {
            ...state.chats,
            byId: {
                ...state.chats.byId,
                [chatId]: { ...chat, archived, updatedAt: now() },
            },
        },
    });
}

export function addUserMessage(state, setState, chatId, text) {
    if (!chatId || !text?.trim()) return null;

    const msg = {
        id: nanoid(),
        role: 'user',
        status: 'done',
        createdAt: now(),
        content: { final: text },
    };

    const prev = state.messages.byChatId[chatId] ?? [];
    const nextMsgs = [...prev, msg];

    setState({
        ...state,
        messages: {
            ...state.messages,
            byChatId: { ...state.messages.byChatId, [chatId]: nextMsgs },
        },
        chats: bumpChatUpdatedAt(state, chatId),
    });

    return msg.id;
}

/**
 * Upsert wiadomości asystenta: przy streamingu w kółko aktualizujesz tę samą wiadomość
 */
export function upsertAssistantMessage(
    state,
    setState,
    chatId,
    {
        messageId = null,
        status = 'streaming',
        modelId = null,
        contentDelta = null, // dopisuj fragment
        contentFinal = null, // ustaw final
        contentThinking = null, // opcjonalnie
    } = {}
) {
    if (!chatId) return null;

    const prev = state.messages.byChatId[chatId] ?? [];

    let id = messageId ?? nanoid();
    let found = false;

    const next = prev.map((m) => {
        if (m.id !== id) return m;
        found = true;

        const prevFinal = m.content?.final ?? '';
        const nextFinal =
            contentFinal != null
                ? contentFinal
                : contentDelta != null
                    ? prevFinal + contentDelta
                    : prevFinal;

        return {
            ...m,
            status,
            modelId: modelId ?? m.modelId,
            content: {
                ...m.content,
                final: nextFinal,
                ...(contentThinking != null ? { thinking: contentThinking } : {}),
            },
        };
    });

    const msgToInsert = found
        ? null
        : {
            id,
            role: 'assistant',
            status,
            createdAt: now(),
            modelId,
            content: {
                ...(contentThinking != null ? { thinking: contentThinking } : {}),
                ...(contentFinal != null ? { final: contentFinal } : { final: contentDelta ?? '' }),
            },
        };

    const nextMsgs = found ? next : [...prev, msgToInsert];

    setState({
        ...state,
        messages: {
            ...state.messages,
            byChatId: { ...state.messages.byChatId, [chatId]: nextMsgs },
        },
        chats: bumpChatUpdatedAt(state, chatId),
    });

    return id;
}

export function setModelsRegistry(state, setState, registry) {
    // registry: [{id,label,provider,runtimeId}, ...]
    const statusesById = { ...state.models.statusesById };
    for (const m of registry) {
        if (!statusesById[m.id]) statusesById[m.id] = 'ok';
    }

    setState({
        ...state,
        models: {
            ...state.models,
            registry,
            statusesById,
            selectedModelId: state.models.selectedModelId ?? registry?.[0]?.id ?? null,
        },
    });
}

export function setSelectedModelId(state, setState, modelId) {
    setState({
        ...state,
        models: { ...state.models, selectedModelId: modelId },
    });
}

export function setModelStatus(state, setState, modelId, status) {
    setState({
        ...state,
        models: {
            ...state.models,
            statusesById: { ...state.models.statusesById, [modelId]: status },
        },
    });
}

// -------- helpers --------
function bumpChatUpdatedAt(state, chatId) {
    const chat = state.chats.byId[chatId];
    if (!chat) return state.chats;

    return {
        ...state.chats,
        byId: {
            ...state.chats.byId,
            [chatId]: { ...chat, updatedAt: now() },
        },
    };
}
