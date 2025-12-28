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

export function setChatTitle(state, setState, chatId, newTitle) {
    const chat = state.chats.byId[chatId];
    if (!chat) return;

    // Validation is now handled by UI (AppDialog) - we just do minimal safety check
    const trimmedTitle = (newTitle || '').trim();
    if (!trimmedTitle) return;

    setState({
        ...state,
        chats: {
            ...state.chats,
            byId: {
                ...state.chats.byId,
                [chatId]: { ...chat, updatedAt: now(), title: trimmedTitle },
            },
        },
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

export function deleteChat(state, setState, chatId) {
    const chat = state.chats.byId[chatId];
    if (!chat) return;

    // Remove from byId
    const { [chatId]: _, ...remainingById } = state.chats.byId;

    // Remove from allIds
    const remainingAllIds = state.chats.allIds.filter((id) => id !== chatId);

    // Remove messages for this chat
    const { [chatId]: __, ...remainingMessages } = state.messages.byChatId;

    // If we're deleting the current chat, select another one
    let nextCurrentChatId = state.chats.currentChatId;
    if (nextCurrentChatId === chatId) {
        // Find the first non-archived chat, or null if none
        const nonArchivedIds = remainingAllIds.filter(
            (id) => remainingById[id] && !remainingById[id].archived
        );
        nextCurrentChatId = nonArchivedIds[0] ?? remainingAllIds[0] ?? null;
    }

    setState({
        ...state,
        chats: {
            byId: remainingById,
            allIds: remainingAllIds,
            currentChatId: nextCurrentChatId,
        },
        messages: {
            ...state.messages,
            byChatId: remainingMessages,
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
                ...(contentThinking != null ? { thinking: m.content.thinking + contentThinking } : {}),
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


// -------- notifications --------
/**
 * @param {import('./types').AppState} state
 * @param {(next: import('./types').AppState) => void} setState
 */
export function addNotification(state, setState, chatId, type, message) {
    if (!chatId || !message?.trim()) return null;

    const role = type === 'error' ? 'error' : 'system';

    const msg = {
        id: nanoid(),
        role,
        status: 'done',
        createdAt: now(),
        content: { final: message },
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

// -------- assistant streaming helpers --------

export function startAssistantMessage(state, setState, chatId, meta = {}) {
    return upsertAssistantMessage(state, setState, chatId, {
        messageId: meta.messageId ?? null,
        status: meta.status ?? 'thinking',
        modelId: meta.modelId ?? null,
        contentFinal: '',
        contentThinking: '',
    });
}

export function appendAssistantDelta(state, setState, chatId, messageId, delta) {
    return upsertAssistantMessage(state, setState, chatId, {
        messageId,
        status: 'streaming',
        contentDelta: delta ?? '',
    });
}

export function appendAssistantThinkingDelta(state, setState, chatId, messageId, delta) {
    return upsertAssistantMessage(state, setState, chatId, {
        messageId,
        status: 'thinking',
        contentThinking: delta ?? '',
    });
}

export function finalizeAssistantMessage(state, setState, chatId, messageId) {
    return upsertAssistantMessage(state, setState, chatId, {
        messageId,
        status: 'done',
    });
}

export function cancelAssistantMessage(state, setState, chatId, messageId) {
    return upsertAssistantMessage(state, setState, chatId, {
        messageId,
        status: 'cancelled',
    });
}

export function errorAssistantMessage(state, setState, chatId, messageId) {
    return upsertAssistantMessage(state, setState, chatId, {
        messageId,
        status: 'error',
    });
}


export function setModelsRegistry(state, setState, registry) {
    // registry: [{id,title,modelName,provider,runtimeId}, ...]
    const nextRegistry = Array.isArray(registry) ? registry : [];

    // Keep previously selected model if it still exists after refresh.
    const prevSelected = state.models.selectedModelId;
    const hasPrev =
        (prevSelected === 0 || !!prevSelected) &&
        nextRegistry.some((m) => m.id === prevSelected);

    const selectedModelId = hasPrev ? prevSelected : nextRegistry?.[0]?.id ?? null;

    // Ensure we have statuses for all models in registry.
    const statusesById = { ...state.models.statusesById };
    for (const m of nextRegistry) {
        const key = String(m.id);
        if (!statusesById[key]) statusesById[key] = 'ok';
    }

    setState({
        ...state,
        models: {
            ...state.models,
            registry: nextRegistry,
            selectedModelId,
            statusesById,
        },
    });
}

export function setSelectedModelId(state, setState, modelId) {
    setState({
        ...state,
        models: { ...state.models, selectedModelId: modelId },
    });
}


export function setModelsStatusesById(state, setState, statusesById, { merge = true } = {}) {
    const next = merge ? { ...state.models.statusesById, ...statusesById } : { ...statusesById };
    setState({
        ...state,
        models: {
            ...state.models,
            statusesById: next,
        },
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
