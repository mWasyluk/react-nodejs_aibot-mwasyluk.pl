import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import TopRightBar from '../topbar/TopRightBar';
import MessageList from './MessageList';
import InputBar from './InputBar';

const Wrap = styled.section`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;

  ${({ theme }) => css`
    background: ${theme.colors.surface}cc;
    border: 1px solid ${theme.colors.border};
    border-radius: 18px;
    backdrop-filter: blur(6px);
    overflow: hidden;
  `}
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;

  ${({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.border};
  `}
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Subtitle = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const Empty = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
`;

const EmptyCard = styled.div`
  max-width: 520px;
  width: 100%;
  padding: 22px 18px;
  border-radius: 16px;

  ${({ theme }) => css`
    background: ${theme.colors.background}55;
    border: 1px dashed ${theme.colors.border};
  `}
`;

const EmptyTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const EmptyText = styled.div`
  font-size: 13px;
  opacity: 0.75;
  line-height: 1.6;
`;

export default function ChatFrame() {
  const { state, selectors } = useAppState();
  const chat = useMemo(() => selectors.selectCurrentChat(state), [state, selectors]);

  const hasChat = !!state.chats.currentChatId && !!chat;

  return (
    <Wrap>
      <Header>
        <HeaderTitle>
          <Title>{hasChat ? (chat.title || 'Untitled chat') : 'AiBot'}</Title>
          <Subtitle>{hasChat ? 'Active conversation' : 'Start a new chat from the sidebar'}</Subtitle>
        </HeaderTitle>
        <TopRightBar />
      </Header>

      <Body>
        {!hasChat ? (
          <Empty>
            <EmptyCard>
              <EmptyTitle>Welcome.</EmptyTitle>
              <EmptyText>
                Pick a chat on the left or create a new one.
                <br />
                No LLM logic yet. Just a well-behaved layout that doesn’t collapse into a single 900-line component.
              </EmptyText>
            </EmptyCard>
          </Empty>
        ) : (
          <>
            <MessageList chatId={state.chats.currentChatId} />
            <InputBar chatId={state.chats.currentChatId} />
          </>
        )}
      </Body>
    </Wrap>
  );
}
