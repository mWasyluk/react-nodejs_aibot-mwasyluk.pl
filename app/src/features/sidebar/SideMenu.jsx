import React, { useMemo, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import {
  Add,
  Search,
  ArchiveOutlined,
  UnarchiveOutlined,
  ChatBubbleOutline,
  Menu,
  MenuOpen,
  Close,
  DeleteOutline,
  Person
} from '@mui/icons-material';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import { IconButton, Tooltip, InputBase } from '@mui/material';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import AppDialog, { useAppDialog } from '../../notifications/AppDialog';
import { useToast } from '../../notifications/Toast';
import { alpha } from '../../utils/colorUtils';

/* ============ STYLED COMPONENTS ============ */

const Wrap = styled.aside`
  width: 320px;
  min-width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 40px;
  background: ${({ theme }) => theme.palette.surface};
  border: 1px solid ${({ theme }) => theme.palette.border};
  backdrop-filter: blur(6px);
`;

const Collapsed = styled.aside`
  width: 56px;
  min-width: 56px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 12px 6px;
  border-radius: 40px;
  background: ${({ theme }) => theme.palette.surface};
  border: 1px solid ${({ theme }) => theme.palette.border};
  backdrop-filter: blur(6px);
`;

/* Przycisk NOWY CHAT - full width, 48px height, 20px border-radius */
const NewChatButton = styled.button`
  width: 100%;
  height: 48px;
  padding: 0 20px;
  border-radius: 20px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.15s ease;
  background: ${({ theme }) => theme.palette.surface};
  color: ${({ theme }) => theme.palette.primary.main};

  &:hover {
    background: ${({ theme }) => alpha(theme.palette.common?.white || '#FFFFFF', 0.5)};
    border-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.25)};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

/* Kontener na przyciski Szukaj / Archiwum */
const TabsRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

/* Przycisk zakładki (Szukaj / Archiwum) - hug content, 36px height */
const TabButton = styled.button`
  height: 36px;
  padding: 0 20px;
  border-radius: 20px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  white-space: nowrap;

  ${({ theme, $active }) => {
    const primaryColor = theme.palette.primary.main;
    const textColor = theme.palette.text.primary;

    return css`
      background: ${$active ? alpha(primaryColor, 0.1) : 'transparent'};
      border-color: ${$active ? alpha(primaryColor, 0.1) : 'transparent'};
      color: ${$active ? primaryColor : textColor};

      &:hover {
        background: ${$active
        ? alpha(primaryColor, 0.1)
        : alpha(theme.palette.common?.white || '#FFFFFF', 0.5)};
        border-color: ${$active
        ? alpha(primaryColor, 0.1)
        : alpha(primaryColor, 0.25)};
      }
    `;
  }}

  svg {
    width: 20px;
    height: 20px;
  }
`;

/* Tytuł sekcji "Czaty" */
const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 10px;
`;

const SectionTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 0.7;
  user-select: none;
`;

const SectionCount = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.5;
`;

/* Pole wyszukiwania - 48px height */
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 14px;
  border-radius: 20px;
  background: ${({ theme }) => theme.palette.surface};
  border: 1px solid ${({ theme }) => theme.palette.border};

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.palette.text.secondary};
    opacity: 0.6;
  }
`;

const SearchInput = styled(InputBase)`
  && {
    flex: 1;
    font-size: 13px;
    color: ${({ theme }) => theme.palette.text.primary};
    
    input::placeholder {
      color: ${({ theme }) => theme.palette.text.secondary};
      opacity: 0.7;
    }
  }
`;

/* Lista czatów */
const List = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: ${({ theme }) => alpha(theme.palette.text.primary, 0.15)};
  }
`;

/* Akcje przy czacie (edycja, archiwizacja, usuwanie) - widoczne na hover */
const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;
  margin-left: auto;
  flex-shrink: 0;
`;

/* Pojedynczy czat - full width, 10px padding X, 5px padding Y, 10px border-radius */
const ChatItem = styled.button`
  width: 100%;
  border: 1px solid transparent;
  text-align: left;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.15s ease;
  background: transparent;
  color: ${({ theme }) => theme.palette.text.primary};

  ${({ theme, $active }) => {
    const primaryColor = theme.palette.primary.main;

    return css`
      background: ${$active ? alpha(primaryColor, 0.1) : 'transparent'};
      border-color: ${$active ? alpha(primaryColor, 0.1) : 'transparent'};

      &:hover {
        background: ${$active
        ? alpha(primaryColor, 0.1)
        : alpha(theme.palette.common?.white || '#FFFFFF', 0.5)};
        border-color: ${$active
        ? alpha(primaryColor, 0.1)
        : alpha(primaryColor, 0.25)};
      }

      &:hover ${ItemActions} {
        opacity: 1;
      }
    `;
  }}

  > svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.palette.text.secondary};
    opacity: 0.7;
    flex-shrink: 0;
  }
`;

const ChatItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

const ChatItemTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const ChatItemMeta = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.6;
`;

/* Przycisk usunięcia - czerwony domyślnie */
const DeleteButton = styled(IconButton)`
  && {
    padding: 4px;
    color: ${({ theme }) => theme.palette.error.main};
    
    &:hover {
      background: ${({ theme }) => theme.palette.error.light};
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

/* Małe IconButtony przy czatach */
const SmallIconButton = styled(IconButton)`
  && {
    padding: 4px;
    color: ${({ theme }) => theme.palette.text.secondary};
    
    &:hover {
      background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
      color: ${({ theme }) => theme.palette.primary.main};
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const UserCard = styled.div`
  width: 100%;
  height: 64px;
  padding: 0 16px 0 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ theme }) => theme.palette.surface};
  border: 1px solid ${({ theme }) => theme.palette.border};
`;

const UserAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => alpha(theme.palette.primary.main, 0.13)};
  color: ${({ theme }) => theme.palette.primary.main};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.primary};
`;

const UserHint = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.6;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.5;
  
  a {
    color: inherit;
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const EmptyMessage = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.6;
  padding: 8px 10px;
`;

/* ============ HELPER FUNCTIONS ============ */

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleDateString();
  } catch {
    return '';
  }
}

/* ============ COMPONENT ============ */

export default function SideMenu() {
  const { state, actions, selectors } = useAppState();
  const { t } = useI18n();
  const { showSuccess } = useToast();
  const chats = useMemo(() => selectors.selectChatsList(state), [state, selectors]);
  const currentChatId = state.chats.currentChatId;
  const isOpen = state.ui.sideMenuOpen;

  const [mode, setMode] = useState('recent'); // 'recent' | 'archive' | 'search'
  const [query, setQuery] = useState('');

  // Dialog state
  const { dialogProps, openDialog } = useAppDialog();

  const normalizedQuery = query.trim().toLowerCase();

  const filteredChats = useMemo(() => {
    let base;
    if (mode === 'archive') {
      base = chats.filter((c) => c.archived);
    } else if (mode === 'search') {
      base = chats; // wszystkie (recent + archived)
    } else {
      base = chats.filter((c) => !c.archived);
    }

    if (mode !== 'search' || !normalizedQuery) return base;

    return base.filter((c) => {
      const title = String(c.title ?? '').toLowerCase();
      if (title.includes(normalizedQuery)) return true;

      const msgs = state.messages.byChatId[c.id] ?? [];
      return msgs.some((m) => {
        const finalText = String(m?.content?.final ?? '').toLowerCase();
        const thinkingText = String(m?.content?.thinking ?? '').toLowerCase();
        return finalText.includes(normalizedQuery) || thinkingText.includes(normalizedQuery);
      });
    });
  }, [chats, mode, normalizedQuery, state.messages.byChatId]);

  const onNewChat = useCallback(() => {
    // actions.createChat({ title: t.newChatDefaultTitle });
    // const newChatId = actions.createChat();
    actions.setCurrentChat(null);
    // }, [actions, t.newChatDefaultTitle]);
  }, [actions]);

  // Validation function for chat title
  const validateChatTitle = useCallback((value) => {
    const trimmed = value?.trim() || '';
    if (!trimmed) {
      return t.dialogRenameChatValidationEmpty || 'Title cannot be empty';
    }
    if (trimmed.length > 100) {
      return t.dialogRenameChatValidationTooLong || 'Title is too long (max 100 characters)';
    }
    return null;
  }, [t]);

  // Open rename dialog
  const invokeTitleChange = useCallback((chatId) => {
    const chat = state.chats.byId[chatId];
    const currentTitle = chat?.title || '';

    openDialog({
      title: t.dialogRenameChatTitle || 'Rename chat',
      type: 'input',
      inputLabel: t.dialogRenameChatLabel || 'Chat title',
      inputValue: currentTitle,
      inputPlaceholder: t.dialogRenameChatPlaceholder || 'Enter new title...',
      validate: validateChatTitle,
      confirmText: t.dialogSave || 'Save',
      cancelText: t.dialogCancel || 'Cancel',
      onConfirm: (newTitle) => {
        const trimmedTitle = newTitle.trim();
        if (trimmedTitle && trimmedTitle !== currentTitle) {
          actions.setChatTitle(chatId, trimmedTitle);
          showSuccess(t.toastSuccessChatRenamed || 'Chat renamed');
        }
      },
    });
  }, [state.chats.byId, openDialog, validateChatTitle, actions, showSuccess, t]);

  // Open delete confirmation dialog
  const invokeDeleteChat = useCallback((chatId) => {
    openDialog({
      title: t.dialogDeleteChatTitle || 'Delete chat',
      type: 'confirm',
      message: t.dialogDeleteChatMessage || 'Are you sure you want to delete this chat? This action cannot be undone.',
      confirmText: t.dialogDeleteChatConfirm || 'Delete',
      cancelText: t.dialogCancel || 'Cancel',
      onConfirm: () => {
        actions.deleteChat(chatId);
        showSuccess(t.toastSuccessChatDeleted || 'Chat deleted');
      },
    });
  }, [openDialog, actions, showSuccess, t]);

  const onToggle = useCallback(() => {
    actions.setSideMenuOpen(!isOpen);
  }, [actions, isOpen]);

  const onSetMode = useCallback((newMode) => {
    if (mode === newMode) {
      setMode('recent');
      setQuery('');
    } else {
      setMode(newMode);
      if (newMode !== 'search') {
        setQuery('');
      }
    }
  }, [mode]);

  const getEmptyMessage = useCallback(() => {
    if (mode === 'archive') return t.sideNoArchivedChats || 'No archived chats.';
    if (mode === 'search' && normalizedQuery) return t.sideNoSearchResults || 'No results found.';
    return t.sideNoChatsYet;
  }, [mode, normalizedQuery, t]);

  const menuIcon = isOpen
    ? <MenuOpen style={{ width: 20, height: 20 }} />
    : <Menu style={{ width: 20, height: 20 }} />;

  /* ===== COLLAPSED STATE ===== */
  if (!isOpen) {
    return (
      <>
        <Collapsed>
          <Tooltip disableInteractive title={t.sideOpenMenuTooltip}>
            <IconButton onClick={onToggle} size="small">
              {menuIcon}
            </IconButton>
          </Tooltip>
          <Tooltip disableInteractive title={t.sideNewChatTooltip}>
            <IconButton onClick={onNewChat} size="small">
              <Add style={{ width: 20, height: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip disableInteractive title={t.sideSearchTooltip}>
            <IconButton onClick={() => { onToggle(); setMode('search'); }} size="small">
              <Search style={{ width: 20, height: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip disableInteractive title={t.sideArchiveTooltip}>
            <IconButton onClick={() => { onToggle(); setMode('archive'); }} size="small">
              <ArchiveOutlined style={{ width: 20, height: 20 }} />
            </IconButton>
          </Tooltip>
        </Collapsed>
        <AppDialog {...dialogProps} />
      </>
    );
  }

  /* ===== EXPANDED STATE ===== */
  return (
    <>
      <Wrap>
        {/* Header z toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip disableInteractive title={t.sideCollapseTooltip}>
            <IconButton onClick={onToggle} size="small">
              {menuIcon}
            </IconButton>
          </Tooltip>
        </div>

        {/* Przycisk NOWY CHAT */}
        <NewChatButton onClick={onNewChat} type="button">
          <Add />
          {t.sideNewChatButton || 'NOWY CHAT'}
        </NewChatButton>

        {/* Zakładki: Szukaj / Archiwum */}
        <TabsRow>
          <TabButton
            $active={mode === 'search'}
            onClick={() => onSetMode('search')}
            type="button"
          >
            <Search />
            {t.sideSearchButton || 'SZUKAJ'}
          </TabButton>
          <TabButton
            $active={mode === 'archive'}
            onClick={() => onSetMode('archive')}
            type="button"
          >
            <ArchiveOutlined />
            {t.sideArchiveButton || 'ARCHIWUM'}
          </TabButton>
        </TabsRow>

        {/* Pole wyszukiwania (tylko w trybie search) */}
        {mode === 'search' && (
          <SearchBar>
            <Search />
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.sideSearchPlaceholder}
              inputProps={{ 'aria-label': t.sideSearchPlaceholder }}
              autoFocus
            />
            {query && (
              <IconButton onClick={() => setQuery('')} size="small">
                <Close style={{ width: 20, height: 20 }} />
              </IconButton>
            )}
          </SearchBar>
        )}

        {/* Nagłówek sekcji */}
        <SectionHeader>
          <SectionTitle>{t.sideChatsTitle}</SectionTitle>
          <SectionCount>{filteredChats.length}</SectionCount>
        </SectionHeader>

        {/* Lista czatów */}
        <List>
          {filteredChats.length === 0 ? (
            <EmptyMessage>{getEmptyMessage()}</EmptyMessage>
          ) : (
            filteredChats.map((c) => (
              <ChatItem
                key={c.id}
                $active={c.id === currentChatId}
                onClick={() => actions.setCurrentChat(c.id)}
                type="button"
              >
                <ChatBubbleOutline />
                <ChatItemText>
                  <ChatItemTitle>{c.title || t.sideUntitledChat}</ChatItemTitle>
                  <ChatItemMeta>
                    {formatDate(c.updatedAt)}
                    {mode === 'search' && c.archived ? ` · ${t.sideArchivedLabel}` : ''}
                  </ChatItemMeta>
                </ChatItemText>

                <ItemActions onClick={(e) => e.stopPropagation()}>
                  <Tooltip disableInteractive title={t.sideChangeChatTitleTooltip}>
                    <SmallIconButton
                      size="small"
                      onClick={() => invokeTitleChange(c.id)}
                    >
                      <CreateRoundedIcon />
                    </SmallIconButton>
                  </Tooltip>

                  <Tooltip disableInteractive title={c.archived ? t.sideUnarchiveTooltip : t.sideArchiveItemTooltip}>
                    <SmallIconButton
                      size="small"
                      onClick={() => actions.archiveChat(c.id, !c.archived)}
                    >
                      {c.archived ? <UnarchiveOutlined /> : <ArchiveOutlined />}
                    </SmallIconButton>
                  </Tooltip>

                  <Tooltip disableInteractive title={t.sideDeleteChatTooltip}>
                    <DeleteButton
                      size="small"
                      onClick={() => invokeDeleteChat(c.id)}
                    >
                      <DeleteOutline />
                    </DeleteButton>
                  </Tooltip>
                </ItemActions>
              </ChatItem>
            ))
          )}
        </List>

        {/* Podgląd użytkownika */}
        <UserCard>
          <UserAvatar>
            <Person />
          </UserAvatar>
          <UserInfo>
            <UserName>{t.sideUserAnonymousTitle || 'Anonimowy Użytkownik'}</UserName>
            <UserHint>{t.sideUserLocalData}</UserHint>
          </UserInfo>
        </UserCard>

        {/* Linki w stopce */}
        <FooterLinks>
          <a href="/docs">{t.sideTermsLink || 'Regulamin'}</a>
          <span>i</span>
          <a href="/docs">{t.sidePrivacyLink || 'polityka prywatności'}</a>
        </FooterLinks>
      </Wrap>

      {/* Dialog component */}
      <AppDialog {...dialogProps} />
    </>
  );
}