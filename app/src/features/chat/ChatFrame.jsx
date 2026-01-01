import React, { useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import TopRightBar from '../topbar/TopRightBar';
import ModelSelector from '../topbar/ModelSelector';
import MessageList from './MessageList';
import InputBar from './InputBar';
import WelcomeScreen from './WelcomeScreen';

/* ============ STYLED COMPONENTS ============ */

const Wrap = styled.section`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  overflow: hidden;
  padding: 20px;
  background: ${({ theme }) => theme.palette.surface};
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 24px;

  /* Dark mode blue glow effect from design */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: ${({ theme }) => theme.palette.gradientGlow || 'transparent'};
    pointer-events: none;
    z-index: 0;
  }
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
  const { state, actions, selectors } = useAppState();
  const { t } = useI18n();

  const chat = useMemo(
    () => selectors.selectCurrentChat(state),
    [state, selectors]
  );

  const hasChat = useMemo(() => Boolean(state.chats.currentChatId && chat), [state.chats.currentChatId]);
  const hasMessages = useMemo(() => (hasChat && Boolean(state.messages.byChatId[state.chats.currentChatId]?.length)), [hasChat, state.chats.currentChatId]);
  const showWelcome = useMemo(() => (!hasChat || !hasMessages), [hasChat, hasMessages]);

  // Handler dla szybkich akcji z WelcomeScreen
  const handleQuickAction = useCallback((actionId) => {
    // Mapowanie akcji na prompty
    const actionPrompts = {
      riddle: t.promptRiddle || 'Wymyśl dla mnie ciekawą zagadkę logiczną.',
      answer: t.promptAnswer || 'Mam zagadkę, pomóż mi ją rozwiązać.',
      code: t.promptCode || 'Pomóż mi napisać kod.',
      story: t.promptStory || 'Napisz krótkie opowiadanie.',
      plan: t.promptPlan || 'Pomóż mi przygotować plan działania.',
      analyze: t.promptAnalyze || 'Przeanalizuj temat, który zaraz ci podam.',
    };

    const prompt = actionPrompts[actionId];
    if (prompt) {
      // Tworzymy nowy czat z domyślnym tytułem
      const newChatId = actions.createChat({ title: prompt.substring(0, 50) });
      // Dodajemy wiadomość użytkownika
      actions.addUserMessage(newChatId, prompt);

      // TODO: Tu można uruchomić streaming odpowiedzi
      // Na razie tylko tworzymy czat z wiadomością
    }
  }, [actions, t]);

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
            <InputBar chatId={null} />
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