import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { Add, Search, ArchiveOutlined, UnarchiveOutlined, ChatBubbleOutline, MenuOpen, Close } from '@mui/icons-material';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import { IconButton, Tooltip, InputBase } from '@mui/material';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';

const Wrap = styled.aside`
  width: 320px;
  min-width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ theme }) => css`
    background: ${theme.colors.surface}cc;
    border: 1px solid ${theme.colors.border};
    border-radius: 18px;
    backdrop-filter: blur(6px);
    padding: 12px;
  `}
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

  ${({ theme }) => css`
    background: ${theme.colors.surface}cc;
    border: 1px solid ${theme.colors.border};
    border-radius: 18px;
    backdrop-filter: blur(6px);
    padding: 10px 6px;
  `}
`;

const TopActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  opacity: 0.9;
  user-select: none;
`;


const ModeHint = styled.div`
  font-size: 12px;
  opacity: 0.75;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 12px;

  ${({ theme }) => css`
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
  `}
`;

const SearchInput = styled(InputBase)`
  flex: 1;
  font-size: 13px;
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.8;
  align-self: end;
  justify-self: end;
`;
const List = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 4px;

  /* Scrollbar, bo czemu nie */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
  }
`;

const Item = styled.button`
  width: 100%;
  border: 0;
  text-align: left;
  cursor: pointer;
  padding: 10px 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  ${({ theme, $active }) => css`
    background: ${$active ? theme.colors.primary + '33' : 'transparent'};
    outline: 1px solid ${$active ? theme.colors.primary + '55' : 'transparent'};

    &:hover {
      background: ${$active ? theme.colors.primary + '40' : theme.colors.surface};
      outline-color: ${$active ? theme.colors.primary + '66' : theme.colors.border};
    }
  `}
`;

const ItemText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  width: 100%;
`;

const ItemTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemMeta = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const UserBadge = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const UserName = styled.div`
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
`;

const UserHint = styled.div`
  font-size: 11px;
  opacity: 0.65;
`;

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleDateString();
  } catch {
    return '';
  }
}

export default function SideMenu() {
  const { state, actions, selectors } = useAppState();
  const { t } = useI18n();
  const chats = useMemo(() => selectors.selectChatsList(state), [state, selectors]);
  const currentChatId = state.chats.currentChatId;
  const isOpen = !!state.ui.sideMenuOpen;

  const [mode, setMode] = useState('recent'); // 'recent' | 'archived' | 'search'
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredChats = useMemo(() => {
    const base =
      mode === 'archived'
        ? chats.filter((c) => c.archived)
        : mode === 'search'
          ? chats
          : chats.filter((c) => !c.archived);

    if (mode !== 'search' || !normalizedQuery) return base;

    return base.filter((c) => {
      const title = String(c.title ?? '').toLowerCase();
      if (title.includes(normalizedQuery)) return true;

      // potem: filtr po treści messages (na start: dość prosto, ale działa)
      const msgs = state.messages.byChatId[c.id] ?? [];
      return msgs.some((m) => {
        const finalText = String(m?.content?.final ?? '').toLowerCase();
        const thinkingText = String(m?.content?.thinking ?? '').toLowerCase();
        return finalText.includes(normalizedQuery) || thinkingText.includes(normalizedQuery);
      });
    });
  }, [chats, mode, normalizedQuery, state.messages.byChatId]);

  const onNewChat = () => actions.createChat({ title: t.newChatDefaultTitle });
  const invokeTitleChange = (chatId) => {
    const next = window.prompt("New chat title:");
    if (!next) return;
    const title = next.trim();
    if (!title) return;
    actions.setChatTitle(chatId, title);
  };
  const onToggle = () => actions.setSideMenuOpen(!isOpen);

  const onToggleSearch = () => {
    setQuery('');
    setMode((m) => (m === 'search' ? 'recent' : 'search'));
  };

  const onToggleArchive = () => {
    setQuery('');
    setMode((m) => (m === 'archived' ? 'recent' : 'archived'));
  };

  if (!isOpen) {
    return (
      <Collapsed>
        <Tooltip title={t.sideOpenMenuTooltip}>
          <IconButton onClick={onToggle} size="small">
            <MenuOpen fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={t.sideNewChatTooltip}>
          <IconButton onClick={onNewChat} size="small">
            <Add fontSize="small" />
          </IconButton>
        </Tooltip>
      </Collapsed>
    );
  }

  return (
    <Wrap>
      <TopActions>
        <Tooltip title={t.sideNewChatTooltip}>
          <IconButton onClick={onNewChat} size="small">
            <Add fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={mode === 'search' ? t.sideSearchCloseTooltip : t.sideSearchTooltip}>
          <IconButton onClick={onToggleSearch} size="small">
            {mode === 'search' ? <Close fontSize="small" /> : <Search fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title={mode === 'archived' ? t.sideArchiveCloseTooltip : t.sideArchiveTooltip}>
          <IconButton onClick={onToggleArchive} size="small">
            <ArchiveOutlined fontSize="small" style={{ opacity: mode === 'archived' ? 1 : 0.85 }} />
          </IconButton>
        </Tooltip>
        <div style={{ flex: 1 }} />
        <Tooltip title={t.sideCollapseTooltip}>
          <IconButton onClick={onToggle} size="small">
            <MenuOpen fontSize="small" />
          </IconButton>
        </Tooltip>
      </TopActions>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Title>{t.sideChatsTitle}</Title>
        <div style={{ fontSize: 12, opacity: 0.65 }}>{filteredChats.length}</div>
      </div>


      {mode === 'search' && (
        <SearchBar>
          <Search fontSize="small" style={{ opacity: 0.8 }} />
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.sideSearchPlaceholder}
            inputProps={{ 'aria-label': t.sideSearchPlaceholder }}
          />
          {query ? (
            <IconButton onClick={() => setQuery('')} size="small">
              <Close fontSize="small" />
            </IconButton>
          ) : null}
        </SearchBar>
      )}

      {mode === 'archived' && (
        <ModeHint>{t.sideArchiveHint}</ModeHint>
      )}
      <List>
        {chats.length === 0 ? (
          <div style={{ fontSize: 13, opacity: 0.7, padding: '6px 4px' }}>
            {t.sideNoChatsYet}
          </div>
        ) : (
          filteredChats.map((c) => (
            <Item
              key={c.id}
              $active={c.id === currentChatId}
              onClick={() => actions.setCurrentChat(c.id)}
              type="button"
            >
              <ChatBubbleOutline fontSize="small" style={{ opacity: 0.85 }} />
              <ItemText>
                <ItemTitle>{c.title || t.sideUntitledChat}</ItemTitle>
                <ItemMeta>
                  {formatDate(c.updatedAt)}
                  {mode === 'search' && c.archived ? ` · ${t.sideArchivedLabel}` : ''}
                </ItemMeta>
              </ItemText>

              <ItemRight onClick={(e) => e.stopPropagation()}>
                <Tooltip title={c.archived ? t.sideUnarchiveTooltip : t.sideArchiveItemTooltip}>
                  <IconButton
                    size="small"
                    onClick={() => actions.archiveChat(c.id, !c.archived)}
                  >
                    {c.archived ? <UnarchiveOutlined fontSize="small" /> : <ArchiveOutlined fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </ItemRight>

              <ItemRight onClick={(e) => e.stopPropagation()}>
                <Tooltip title={t.sideChangeChatTitleTooltip}>
                  <IconButton
                    size="small"
                    onClick={() => invokeTitleChange(c.id)}
                  >
                    <CreateRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ItemRight>
            </Item>
          )))}
      </List>

      <Footer>
        <UserBadge>
          <UserName>{t.sideUserAnonymous}</UserName>
          <UserHint>{t.sideUserLocalData}</UserHint>
        </UserBadge>

        {/* Placeholder for future user/actions */}
        <div style={{ width: 8 }} />
      </Footer>
    </Wrap>
  );
}
