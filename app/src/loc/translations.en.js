/**
 * Source of truth for i18n keys.
 *
 * Keep keys stable: VSCode autocomplete relies on these explicit property names.
 * Add new keys here first (EN), then mirror them in PL.
 */
export const en = Object.freeze({
  // TopRightBar
  topbarThemeTooltip: 'Theme',
  topbarLanguageTooltip: 'Language',
  topbarSettingsTooltip: 'Settings (not wired yet)',

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

  // InputBar
  inputMultilineHint: 'Enter to send, Shift+Enter for a new line.',

  // Generic
  newChatDefaultTitle: 'New chat',
});