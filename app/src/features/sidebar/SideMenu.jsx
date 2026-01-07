import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';

import ChatList from './ChatList';
import Footer from './Footer';
import Header from './Header';
import UserCard from './UserCard';

/* ============ STYLED ============ */

const Wrap = styled.aside`
  width: ${({ $collapsed }) => ($collapsed ? '72px' : '320px')};
  min-width: ${({ $collapsed }) => ($collapsed ? '72px' : '320px')};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${({ $collapsed }) => ($collapsed ? 'center' : 'stretch')};
  gap: ${({ $collapsed }) => ($collapsed ? '8px' : '12px')};
  padding: 10px;
  border-radius: 20px;
  background: ${({ theme }) => theme.palette.surface};
  backdrop-filter: blur(6px);
  transition: width 0.2s ease, min-width 0.2s ease;
  overflow: hidden;
`;

/* ============ COMPONENT ============ */

export default function SideMenu() {
  const { state, actions, selectors } = useAppState();
  const { t } = useI18n();

  // === STATE ===
  const chats = useMemo(() => selectors.selectChatsList(state), [state, selectors]);
  const currentChatId = state.chats.currentChatId;
  const isCollapsed = !state.ui.sideMenuOpen;

  const [mode, setMode] = useState('recent'); // 'recent' | 'archive' | 'search'

  // === ACTIONS ===
  const onToggle = useCallback(() => {
    actions.setSideMenuOpen(isCollapsed);
  }, [actions, isCollapsed]);

  const onNewChat = useCallback(() => {
    actions.setCurrentChat(null);
  }, [actions]);

  const onSetMode = useCallback((newMode) => {
    if (mode === newMode) {
      setMode('recent');
    } else {
      setMode(newMode);
    }
  }, [mode]);

  return (
    <Wrap $collapsed={isCollapsed}>
      <Header
        isCollapsed={isCollapsed}
        mode={mode}
        onToggle={onToggle}
        onNewChat={onNewChat}
        onSetMode={onSetMode}
        t={t}
      />

      <ChatList
        chats={chats}
        messages={state.messages}
        currentChatId={currentChatId}
        isCollapsed={isCollapsed}
        mode={mode}
        actions={actions}
        t={t}
      />

      <UserCard isCollapsed={isCollapsed} t={t} />

      <Footer isCollapsed={isCollapsed} t={t} />
    </Wrap>
  );
}