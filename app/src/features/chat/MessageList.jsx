import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useAppState } from '../../context/AppStateContext';

const Wrap = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.22);
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: ${({ $role }) => ($role === 'user' ? 'flex-end' : $role === 'assistant' ? 'flex-start' : 'center')};
  // justify-content: ${({ $role }) => ($role === 'user' ? 'flex-end' : 'flex-start')};
`;

const Bubble = styled.div`
  max-width: 78%;
  padding: 10px 12px;
  border-radius: 14px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.55;
  font-size: 13px;

  ${({ theme, $role }) => {
    const isUser = $role === 'user';
    const isError = $role === 'error';

    return css`
      background: ${isUser ? theme.colors.primary + '33' : theme.colors.background + '55'};
      border: 1px solid ${isUser ? theme.colors.primary + '55' : theme.colors.border};
      background-color: ${isError && theme.colors.error.background};
    `;
  }}
`;

const Thinking = styled.div`
  max-width: 78%;
  padding: 10px 12px;
  border-radius: 14px;
  font-size: 13px;
  opacity: 0.85;
  ${({ theme, $role }) => css`
    background: ${$role === 'user' ? theme.colors.primary + '22' : theme.colors.border + '55'};
    color: ${theme.colors.text.secondary};
    border: 1px dashed ${theme.colors.border};
  `}
`;

const Meta = styled.div`
  margin-top: 4px;
  font-size: 11px;
  opacity: 0.65;
  text-align: ${({ $role }) => ($role === 'user' ? 'right' : $role === 'assistant' ? 'left' : 'center')};
`;

function time(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function MessageList({ chatId }) {
  const { state, selectors } = useAppState();
  const messages = useMemo(() => selectors.selectMessagesForChat(state, chatId), [state, selectors, chatId]);

  if (!messages.length) {
    return (
      <Wrap>
        <div style={{ fontSize: 13, opacity: 0.75 }}>
          No messages yet. Type something and pretend it’s meaningful.
        </div>
      </Wrap>
    );
  }

  return (
    <Wrap>
      {messages.map((m) => {
        const role = m.role || 'assistant';
        const status = m.status || 'done';
        const finalText = m?.content?.final ?? '';
        const thinkingText = m?.content?.thinking ?? '';
        const showCursor = status === 'streaming';
        const text = finalText + (showCursor ? '▍' : '');
        return (
          <div key={m.id}>
            <Row $role={role}>
              {thinkingText ? (
                <Thinking $role={role}>{thinkingText}</Thinking>
              ) : null}
              <Bubble $role={role}>{text}</Bubble>
            </Row>
            <Meta $role={role}>
              {role} · {time(m.createdAt)}
            </Meta>
          </div>
        );
      })}
    </Wrap>
  );
}
