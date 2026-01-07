/**
 * Source of truth for i18n keys.
 *
 * Keep keys stable: VSCode autocomplete relies on these explicit property names.
 * Add new keys here first (EN), then mirror them in PL.
 */
export const en = Object.freeze({
  // TopRightBar / Settings
  topbarThemeTooltip: 'Theme',
  topbarLanguageTooltip: 'Language',
  topbarSettingsTooltip: 'Settings',
  settingsTheme: 'Theme',
  settingsThemeLight: 'Light',
  settingsThemeDark: 'Dark',
  settingsLanguage: 'Language',

  // Model Selector
  modelSelectLabel: 'Model',
  modelSelectPlaceholder: 'Select model',
  modelErrorNotFound: 'Model not found',

  // Welcome Screen
  welcomeGreeting: 'Tell me,',
  welcomeTitle: 'What shall we start with today?',
  welcomeSubtitle: 'Choose one of the options to start a chat with a predefined action, or type your own command in the field below.',
  welcomeActionRiddle: 'Create a logic riddle',
  welcomeActionAnswer: 'Answer a riddle',
  welcomeActionCode: 'Write code',
  welcomeActionStory: 'Write a story',
  welcomeActionPlan: 'Prepare an action plan',
  welcomeActionAnalyze: 'Analyze a topic',

  // Quick action prompts
  promptRiddle: 'Come up with a logic riddle with word length from 0 to',
  promptAnswer: 'Help me solve this logic riddle:',
  promptCode: 'Help me write code that',
  promptStory: 'Write a short story about',
  promptPlan: 'Help me prepare an action plan for',
  promptAnalyze: 'Analyze information about the topic:',

  // InputBar
  inputPlaceholder: 'How can I help you today?',
  inputSend: 'Send',
  inputMoreOptions: 'More options',
  inputSaveLocal: 'Save locally',
  inputThinking: 'Thinking',
  inputDisclaimer: 'All models can make mistakes. Verify important information.',
  inputMultilineHint: 'Enter to send, Shift+Enter for a new line.',

  // SideMenu
  sideOpenMenuTooltip: 'Open menu',
  sideNewChatTooltip: 'New chat',
  sideNewChatButton: 'NEW CHAT',
  sideCollapseTooltip: 'Collapse',
  sideSearchTooltip: 'Search',
  sideSearchButton: 'SEARCH',
  sideArchiveTooltip: 'Archive',
  sideArchiveButton: 'ARCHIVE',
  sideChatsTitle: 'Chats',
  sideRecentTitle: 'Recent',
  sideArchiveTitle: 'Archive',
  sideSearchTitle: 'Search',
  sideNoChatsYet: 'No chats yet. Humans love empty lists.',
  sideNoArchivedChats: 'No archived chats.',
  sideNoSearchResults: 'No results found.',
  sideUntitledChat: 'Untitled',
  sideUserAnonymous: 'Anonymous',
  sideUserAnonymousTitle: 'Anonymous User',
  sideUserLocalData: 'Data stored locally',
  sideSearchCloseTooltip: 'Close search',
  sideArchiveCloseTooltip: 'Back to recent',
  sideSearchPlaceholder: 'Search in title and messages...',
  sideArchiveHint: 'Archived chats',
  sideArchivedLabel: 'archived',
  sideArchiveItemTooltip: 'Archive',
  sideUnarchiveTooltip: 'Unarchive',
  sideChangeChatTitleTooltip: 'Rename',
  sideChangeChatTitlePrompt: 'New chat title:',
  sideDeleteChatTooltip: 'Delete',
  sideDeleteChatConfirm: 'Are you sure you want to delete this chat?',
  sideTermsLink: 'Terms',
  sidePrivacyLink: 'privacy policy',

  // Generic
  newChatDefaultTitle: 'New chat',

  // Dialog - common
  dialogConfirm: 'Confirm',
  dialogCancel: 'Cancel',
  dialogOk: 'OK',
  dialogClose: 'Close',
  dialogSave: 'Save',

  // Dialog - rename chat
  dialogRenameChatTitle: 'Rename chat',
  dialogRenameChatLabel: 'Chat title',
  dialogRenameChatPlaceholder: 'Enter new title...',
  dialogRenameChatValidationEmpty: 'Title cannot be empty',
  dialogRenameChatValidationTooLong: 'Title is too long (max 100 characters)',

  // Dialog - delete chat
  dialogDeleteChatTitle: 'Delete chat',
  dialogDeleteChatMessage: 'Are you sure you want to delete this chat? This action cannot be undone.',
  dialogDeleteChatConfirm: 'Delete',

  // Dialog - archive chat
  dialogArchiveChatTitle: 'Archive chat',
  dialogArchiveChatMessage: 'Are you sure you want to archive this chat?',
  dialogArchiveChatConfirm: 'Archive',

  // Toast - errors
  toastErrorTitle: 'Error',
  toastErrorSaveFailed: 'Failed to save changes',
  toastErrorStreamInterrupted: 'Stream interrupted',
  toastErrorStreamAborted: 'Response generation cancelled',
  toastErrorFetchModels: 'Failed to fetch models',
  toastErrorModelNotFound: 'Selected model not found',
  toastErrorNetworkError: 'Network error. Check your connection.',
  toastErrorUnknown: 'An unexpected error occurred',

  // Toast - success
  toastSuccessTitle: 'Success',
  toastSuccessSaved: 'Changes saved successfully',
  toastSuccessChatRenamed: 'Chat renamed',
  toastSuccessChatArchived: 'Chat archived',
  toastSuccessChatDeleted: 'Chat deleted',

  // Toast - warning
  toastWarningTitle: 'Warning',
  toastWarningModelMayFail: 'This model may not work correctly',

  // Toast - info
  toastInfoTitle: 'Info',
  toastInfoStreamingStarted: 'Generating response...',

  // Message status
  messageStatusCancelled: 'Response cancelled',
  messageStatusError: 'An error occurred',
  messageStatusThinking: 'Thinking...',
});