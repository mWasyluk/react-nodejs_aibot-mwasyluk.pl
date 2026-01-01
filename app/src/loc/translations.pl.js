export const pl = Object.freeze({
  // TopRightBar / Settings
  topbarThemeTooltip: 'Motyw',
  topbarLanguageTooltip: 'Język',
  topbarSettingsTooltip: 'Ustawienia',
  settingsTheme: 'Motyw',
  settingsThemeLight: 'Jasny',
  settingsThemeDark: 'Ciemny',
  settingsLanguage: 'Język',

  // Model Selector
  modelSelectLabel: 'Model',
  modelSelectPlaceholder: 'Wybierz model',
  modelErrorNotFound: 'Model nie znaleziony',

  // Welcome Screen
  welcomeGreeting: 'Powiedz mi,',
  welcomeTitle: 'Od czego zaczniemy tym razem?',
  welcomeSubtitle: 'Wybierz jedną z opcji, aby rozpocząć czat od zdefiniowanej akcji, lub wpisz swoją własną komendę w oknie poniżej.',
  welcomeActionRiddle: 'Wymyśl zagadkę logiczną',
  welcomeActionAnswer: 'Odpowiedz na zagadkę',
  welcomeActionCode: 'Napisz kod',
  welcomeActionStory: 'Napisz opowiadanie',
  welcomeActionPlan: 'Przygotuj plan działania',
  welcomeActionAnalyze: 'Przeanalizuj temat',

  // Quick action prompts
  promptRiddle: 'Wymyśl dla mnie ciekawą zagadkę logiczną.',
  promptAnswer: 'Mam zagadkę, pomóż mi ją rozwiązać.',
  promptCode: 'Pomóż mi napisać kod.',
  promptStory: 'Napisz krótkie opowiadanie.',
  promptPlan: 'Pomóż mi przygotować plan działania.',
  promptAnalyze: 'Przeanalizuj temat, który zaraz ci podam.',

  // InputBar
  inputPlaceholder: 'W czym mogę Ci dzisiaj pomóc?',
  inputSend: 'Wyślij',
  inputMoreOptions: 'Więcej opcji',
  inputSaveLocal: 'Zapis lokalny',
  inputThinking: 'Myślenie',
  inputDisclaimer: 'Wszystkie modele mogą popełniać błędy. Sprawdzaj ważne informacje.',
  inputMultilineHint: 'Enter aby wysłać, Shift+Enter aby dodać nową linię.',

  // SideMenu
  sideOpenMenuTooltip: 'Otwórz menu',
  sideNewChatTooltip: 'Nowy czat',
  sideNewChatButton: 'NOWY CHAT',
  sideCollapseTooltip: 'Zwiń',
  sideSearchTooltip: 'Szukaj',
  sideSearchButton: 'SZUKAJ',
  sideArchiveTooltip: 'Archiwum',
  sideArchiveButton: 'ARCHIWUM',
  sideChatsTitle: 'Czaty',
  sideRecentTitle: 'Ostatnie',
  sideArchiveTitle: 'Archiwum',
  sideSearchTitle: 'Wyszukiwanie',
  sideNoChatsYet: 'Brak czatów. Ludzie kochają puste listy.',
  sideNoArchivedChats: 'Brak zarchiwizowanych czatów.',
  sideNoSearchResults: 'Brak wyników.',
  sideUntitledChat: 'Bez tytułu',
  sideUserAnonymous: 'Anonimowy',
  sideUserAnonymousTitle: 'Anonimowy Użytkownik',
  sideUserLocalData: 'Dane przechowywane lokalnie',
  sideSearchCloseTooltip: 'Zamknij wyszukiwanie',
  sideArchiveCloseTooltip: 'Wróć do ostatnich',
  sideSearchPlaceholder: 'Szukaj w tytule i wiadomościach...',
  sideArchiveHint: 'Zarchiwizowane czaty',
  sideArchivedLabel: 'archiwum',
  sideArchiveItemTooltip: 'Archiwizuj',
  sideUnarchiveTooltip: 'Przywróć',
  sideChangeChatTitleTooltip: 'Zmień nazwę',
  sideChangeChatTitlePrompt: 'Nowa nazwa czatu:',
  sideDeleteChatTooltip: 'Usuń',
  sideDeleteChatConfirm: 'Czy na pewno chcesz usunąć ten czat?',
  sideTermsLink: 'Regulamin',
  sidePrivacyLink: 'polityka prywatności',

  // Generic
  newChatDefaultTitle: 'Nowy czat',

  // Dialog - common
  dialogConfirm: 'Potwierdź',
  dialogCancel: 'Anuluj',
  dialogOk: 'OK',
  dialogClose: 'Zamknij',
  dialogSave: 'Zapisz',

  // Dialog - rename chat
  dialogRenameChatTitle: 'Zmień nazwę czatu',
  dialogRenameChatLabel: 'Tytuł czatu',
  dialogRenameChatPlaceholder: 'Wpisz nowy tytuł...',
  dialogRenameChatValidationEmpty: 'Tytuł nie może być pusty',
  dialogRenameChatValidationTooLong: 'Tytuł jest za długi (max 100 znaków)',

  // Dialog - delete chat
  dialogDeleteChatTitle: 'Usuń czat',
  dialogDeleteChatMessage: 'Czy na pewno chcesz usunąć ten czat? Tej operacji nie można cofnąć.',
  dialogDeleteChatConfirm: 'Usuń',

  // Dialog - archive chat
  dialogArchiveChatTitle: 'Archiwizuj czat',
  dialogArchiveChatMessage: 'Czy na pewno chcesz zarchiwizować ten czat?',
  dialogArchiveChatConfirm: 'Archiwizuj',

  // Toast - errors
  toastErrorTitle: 'Błąd',
  toastErrorSaveFailed: 'Nie udało się zapisać zmian',
  toastErrorStreamInterrupted: 'Stream przerwany',
  toastErrorStreamAborted: 'Generowanie odpowiedzi anulowane',
  toastErrorFetchModels: 'Błąd pobierania modeli',
  toastErrorModelNotFound: 'Wybrany model nie został odnaleziony',
  toastErrorNetworkError: 'Błąd sieci. Sprawdź połączenie.',
  toastErrorUnknown: 'Wystąpił nieoczekiwany błąd',

  // Toast - success
  toastSuccessTitle: 'Sukces',
  toastSuccessSaved: 'Zmiany zostały zapisane',
  toastSuccessChatRenamed: 'Nazwa czatu zmieniona',
  toastSuccessChatArchived: 'Czat zarchiwizowany',
  toastSuccessChatDeleted: 'Czat usunięty',

  // Toast - warning
  toastWarningTitle: 'Ostrzeżenie',
  toastWarningModelMayFail: 'Ten model może nie działać poprawnie',

  // Toast - info
  toastInfoTitle: 'Informacja',
  toastInfoStreamingStarted: 'Generowanie odpowiedzi...',

  // Message status
  messageStatusCancelled: 'Odpowiedź anulowana',
  messageStatusError: 'Wystąpił błąd',
  messageStatusThinking: 'Myślę...',
});