import { Close } from '@mui/icons-material';
import { IconButton, InputBase, Tooltip } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as ArchiveAddIcon } from '../../assets/svg/archive-add.svg';
import { ReactComponent as ArchiveRemoveIcon } from '../../assets/svg/archive-remove.svg';
import { ReactComponent as BinIcon } from '../../assets/svg/bin.svg';
import { ReactComponent as ChatIcon } from '../../assets/svg/chat.svg';
import { ReactComponent as EditIcon } from '../../assets/svg/edit.svg';
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg';
import AppDialog, { useAppDialog } from '../../notifications/AppDialog';
import { useToast } from '../../notifications/Toast';
import { alpha } from '../../utils/colorUtils';

/* ============ STYLED ============ */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
  width: 100%;
`;

const SearchBar = styled.div`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
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
    color: ${({ theme }) => theme.palette.text.main};
    
    input::placeholder {
      color: ${({ theme }) => theme.palette.text.secondary};
      opacity: 0.7;
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  align-items: baseline;
  justify-content: space-between;
  padding: 0 10px;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.main};
  opacity: 0.7;
  user-select: none;
`;

const SectionCount = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.5;
`;

const List = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: ${({ theme }) => alpha(theme.palette.text.main, 0.15)};
  }
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;
  margin-left: auto;
  flex-shrink: 0;
`;

const ChatItem = styled.button`
  width: 100%;
  height: 36px;
  width:  ${({ $collapsed }) => ($collapsed ? '36px' : '100%')};
  border: 1px solid transparent;
  text-align: left;
  cursor: pointer;
  padding: ${({ $collapsed }) => ($collapsed ? '10px 8px' : '10px')};
  border-radius: 10px;
  display: flex;
  align-items: center;
  /* justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')}; */
  justify-content: flex-start;
  gap: ${({ $collapsed }) => ($collapsed ? '0' : '10px')};
  transition: all 0.2s ease;
  background: ${({ theme, $active }) =>
    $active ? alpha(theme.palette.primary.main, 0.2) : 'transparent'};
  /* border-color: ${({ theme, $active }) =>
    $active ? alpha(theme.palette.primary.main, 0.1) : 'transparent'}; */
  /* color: ${({ theme, $active }) => $active ? theme.palette.primary.dark : theme.palette.text.main}; */

  &:hover {
    background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    /* border-color: ${({ theme, $active }) =>
    $active
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.25)}; */
  }

  &:active {
    background: ${({ theme }) => alpha(theme.palette.primary.main, 0.3)};
  }

  &:hover ${ItemActions} {
    opacity: 1;
  }

  > svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.palette.text.secondary};
    opacity: 0.7;
    flex-shrink: 0;
  }
`;

const ChatItemText = styled.div`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
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
  color: ${({ theme, $active }) => $active ? theme.palette.primary.dark : theme.palette.text.main}; 
`;

const ChatItemMeta = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.6;
`;

const SmallIconButton = styled(IconButton)`
  && {
    padding: 4px;
    
    &:hover {
      background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    }
    
    svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.palette.text.main};
    }

    &:hover svg {
        color: ${({ theme }) => theme.palette.primary.dark};
    }
  }
`;

const DeleteButton = styled(IconButton)`
  && {
    padding: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.palette.error.light};
    }

    svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.palette.error.main};
    }
  }
`;

const EmptyMessage = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.6;
  padding: 8px 10px;
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
`;

/* ============ HELPERS ============ */

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleDateString();
  } catch {
    return '';
  }
}

/* ============ COMPONENT ============ */

export default function ChatList({
  chats,
  messages,
  currentChatId,
  isCollapsed,
  mode,
  actions,
  t,
}) {
  const { showSuccess } = useToast();
  const { dialogProps, openDialog } = useAppDialog();
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  // === FILTERING ===
  const filteredChats = useMemo(() => {
    let base;
    if (mode === 'archive') {
      base = chats.filter((c) => c.archived);
    } else if (mode === 'search') {
      base = chats;
    } else {
      base = chats.filter((c) => !c.archived);
    }

    if (mode !== 'search' || !normalizedQuery) return base;

    return base.filter((c) => {
      const title = String(c.title ?? '').toLowerCase();
      if (title.includes(normalizedQuery)) return true;

      const msgs = messages.byChatId[c.id] ?? [];
      return msgs.some((m) => {
        const finalText = String(m?.content?.final ?? '').toLowerCase();
        const thinkingText = String(m?.content?.thinking ?? '').toLowerCase();
        return finalText.includes(normalizedQuery) || thinkingText.includes(normalizedQuery);
      });
    });
  }, [chats, mode, normalizedQuery, messages.byChatId]);

  // === EMPTY MESSAGE ===
  const emptyMessage = useMemo(() => {
    if (mode === 'archive') return t.sideNoArchivedChats || 'No archived chats.';
    if (mode === 'search' && normalizedQuery) return t.sideNoSearchResults || 'No results found.';
    return t.sideNoChatsYet;
  }, [mode, normalizedQuery, t]);

  // === DIALOGS ===
  const validateTitle = useCallback((value) => {
    const trimmed = value?.trim() || '';
    if (!trimmed) return t.dialogRenameChatValidationEmpty || 'Title cannot be empty';
    if (trimmed.length > 100) return t.dialogRenameChatValidationTooLong || 'Title is too long (max 100 characters)';
    return null;
  }, [t]);

  const onRenameChat = useCallback((chatId, currentTitle) => {
    openDialog({
      title: t.dialogRenameChatTitle || 'Rename chat',
      type: 'input',
      inputLabel: t.dialogRenameChatLabel || 'Chat title',
      inputValue: currentTitle,
      inputPlaceholder: t.dialogRenameChatPlaceholder || 'Enter new title...',
      validate: validateTitle,
      confirmText: t.dialogSave || 'Save',
      cancelText: t.dialogCancel || 'Cancel',
      onConfirm: (newTitle) => {
        const trimmed = newTitle.trim();
        if (trimmed && trimmed !== currentTitle) {
          actions.setChatTitle(chatId, trimmed);
          showSuccess(t.toastSuccessChatRenamed || 'Chat renamed');
        }
      },
    });
  }, [openDialog, validateTitle, actions, showSuccess, t]);

  const onDeleteChat = useCallback((chatId) => {
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

  return (
    <>
      <Wrap>
        {/* Search Bar */}
        {mode === 'search' && (
          <SearchBar $collapsed={isCollapsed}>
            <SearchIcon />
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.sideSearchPlaceholder}
              inputProps={{ 'aria-label': t.sideSearchPlaceholder }}
              autoFocus
            />
            {query && (
              <IconButton onClick={() => setQuery('')} size="small">
                <Close sx={{ width: 20, height: 20 }} />
              </IconButton>
            )}
          </SearchBar>
        )}

        {/* Section Header */}
        <SectionHeader $collapsed={isCollapsed}>
          <SectionTitle>{t.sideChatsTitle}</SectionTitle>
          <SectionCount>{filteredChats.length}</SectionCount>
        </SectionHeader>

        {/* Chat List */}
        <List>
          {filteredChats.length === 0 ? (
            <EmptyMessage $collapsed={isCollapsed}>{emptyMessage}</EmptyMessage>
          ) : (
            filteredChats.map((chat) => {
              const title = chat.title || t.sideUntitledChat || 'Untitled';
              const isActive = chat.id === currentChatId;

              if (isCollapsed) {
                return (
                  <Tooltip key={chat.id} disableInteractive title={title} placement="right">
                    <ChatItem
                      $active={isActive}
                      $collapsed={isCollapsed}
                      onClick={() => actions.setCurrentChat(chat.id)}
                      type="button"
                    >
                      <ChatIcon />
                    </ChatItem>
                  </Tooltip>
                );
              }

              return (
                <ChatItem
                  key={chat.id}
                  $active={isActive}
                  $collapsed={isCollapsed}
                  onClick={() => actions.setCurrentChat(chat.id)}
                  type="button"
                >
                  <ChatIcon />

                  <ChatItemText $collapsed={isCollapsed}>
                    <ChatItemTitle $active={isActive}>{title}</ChatItemTitle>
                    <ChatItemMeta>
                      {formatDate(chat.updatedAt)}
                      {mode === 'search' && chat.archived ? ` · ${t.sideArchivedLabel}` : ''}
                    </ChatItemMeta>
                  </ChatItemText>

                  <ItemActions onClick={(e) => e.stopPropagation()}>
                    <Tooltip disableInteractive title={t.sideChangeChatTitleTooltip}>
                      <SmallIconButton
                        size="small"
                        onClick={() => onRenameChat(chat.id, chat.title || '')}
                      >
                        <EditIcon />
                      </SmallIconButton>
                    </Tooltip>

                    <Tooltip disableInteractive title={chat.archived ? t.sideUnarchiveTooltip : t.sideArchiveItemTooltip}>
                      <SmallIconButton
                        size="small"
                        onClick={() => actions.archiveChat(chat.id, !chat.archived)}
                      >
                        {chat.archived ? <ArchiveRemoveIcon /> : <ArchiveAddIcon />}
                      </SmallIconButton>
                    </Tooltip>

                    <Tooltip disableInteractive title={t.sideDeleteChatTooltip}>
                      <DeleteButton size="small" onClick={() => onDeleteChat(chat.id)}>
                        <BinIcon />
                      </DeleteButton>
                    </Tooltip>
                  </ItemActions>
                </ChatItem>
              );
            })
          )}
        </List>
      </Wrap>

      {/* Dialog */}
      <AppDialog {...dialogProps} />
    </>
  );
}