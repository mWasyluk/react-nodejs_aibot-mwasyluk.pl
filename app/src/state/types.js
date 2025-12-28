/**
 * @typedef {typeof import('./constants').THEME[keyof typeof import('./constants').THEME]} ThemeMode
 * @typedef {typeof import('./constants').LANGUAGE[keyof typeof import('./constants').LANGUAGE]} Language
 *
 * @typedef {'ok'|'missing'|'error'|'requiresConfig'} ModelStatus
 *
 * @typedef {Object} UiState
 * @property {ThemeMode} theme
 * @property {Language} language
 * @property {boolean} sideMenuOpen
 *
 * @typedef {Object} Chat
 * @property {string} id
 * @property {string} title
 * @property {number} createdAt
 * @property {number} updatedAt
 * @property {boolean} archived
 *
 * @typedef {'user'|'assistant'|'system'|'error'} MessageRole
 * @typedef {'pending'|'thinking'|'streaming'|'done'|'error'|'cancelled'} MessageStatus
 *
 * @typedef {Object} Message
 * @property {string} id
 * @property {MessageRole} role
 * @property {MessageStatus} status
 * @property {number} createdAt
 * @property {string=} modelId
 * @property {{ final?: string, thinking?: string }} content
 *
 * @typedef {Object} ChatsState
 * @property {Object.<string, Chat>} byId
 * @property {string[]} allIds
 * @property {string|null} currentChatId
 *
 * @typedef {Object} MessagesState
 * @property {Object.<string, Message[]>} byChatId
 *
 * @typedef {Object} ModelsState
 * @property {Array<{id: string|number, title: string, modelName?: string, provider?: string, runtimeId?: string}>} registry
 * @property {string|null} selectedModelId
 * @property {Object.<string, ModelStatus>} statusesById
 *
 * @typedef {Object} AppState
 * @property {UiState} ui
 * @property {ChatsState} chats
 * @property {MessagesState} messages
 * @property {ModelsState} models
 */

export { };
