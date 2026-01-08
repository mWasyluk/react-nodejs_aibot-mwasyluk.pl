import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import ModelSelector from '../topbar/ModelSelector';
import TopRightBar from '../topbar/TopRightBar';
import InputBar from './InputBar';
import MessageList from './MessageList';
import { getActionById, getActionPrompt } from './quickactions.config';
import WelcomeScreen from './WelcomeScreen';

/* ============ STYLED COMPONENTS ============ */

const Wrap = styled.section`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 10px;
  background: ${({ theme }) => theme.palette.surface};
  backdrop-filter: blur(6px);
  border-radius: 20px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 999;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 10px;
  z-index: 1;
`;

const Disclaimer = styled.div`
  text-align: center;
  font-size: 11px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.7;
`;

/* ============ COMPONENT ============ */

export default function ChatFrame() {
  const { state, selectors } = useAppState();
  const { t, lang } = useI18n();
  const [quickPrompt, setQuickPrompt] = useState('');

  const chat = useMemo(
    () => selectors.selectCurrentChat(state),
    [state, selectors]
  );

  const hasChat = useMemo(() => Boolean(state.chats.currentChatId && chat), [state.chats.currentChatId, chat]);
  const hasMessages = useMemo(() => (hasChat && Boolean(state.messages.byChatId[state.chats.currentChatId]?.length)), [hasChat, state.messages.byChatId, state.chats.currentChatId]);
  const showWelcome = useMemo(() => (!hasChat || !hasMessages), [hasChat, hasMessages]);

  // Handler dla szybkich akcji z WelcomeScreen
  const handleQuickAction = useCallback((actionId) => {
    const action = getActionById(actionId);

    if (action) {
      const prompt = getActionPrompt(action, t, lang);
      setQuickPrompt(prompt);
    }
  }, [t, lang]);

  const userName = t.sideUserAnonymous || 'Anonimowy';
  const disclaimer = t.inputDisclaimer || 'Wszystkie modele mogą popełniać błędy. Sprawdzaj ważne informacje.';

  return (
    <Wrap>
      <Header>
        <HeaderLeft>
          <ModelSelector />
        </HeaderLeft>
        <HeaderRight>
          <TopRightBar />
        </HeaderRight>
      </Header>

      <Body>
        {showWelcome ? (
          <>
            <WelcomeScreen
              userName={userName}
              onActionClick={handleQuickAction}
            />
            <InputBar chatId={null} initialPrompt={quickPrompt} />
          </>
        ) : (
          <>
            <MessageList chatId={state.chats.currentChatId} />
            <InputBar chatId={state.chats.currentChatId} />
          </>
        )}
        <Disclaimer>{disclaimer}</Disclaimer>
      </Body>
    </Wrap>
  );
}