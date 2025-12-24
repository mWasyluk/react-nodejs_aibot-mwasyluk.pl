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
  sideCollapseTooltip: 'Collapse',
  sideSearchTooltip: 'Search (not wired yet)',
  sideArchiveTooltip: 'Archive (not wired yet)',
  sideChatsTitle: 'Chats',
  sideNoChatsYet: 'No chats yet. Humans love empty lists.',
  sideUntitledChat: 'Untitled',
  sideUserAnonymous: 'Anonymous',
  sideUserLocalData: 'Local data',
  sideSearchCloseTooltip: 'Close search',
  sideArchiveCloseTooltip: 'Back to recent',
  sideSearchPlaceholder: 'Search chats…',
  sideArchiveHint: 'Archived chats',
  sideArchivedLabel: 'archived',
  sideArchiveItemTooltip: 'Archive',
  sideUnarchiveTooltip: 'Unarchive',
  sideChangeChatTitleTooltip: 'Rename',

  // Generic
  newChatDefaultTitle: 'New chat',
});
