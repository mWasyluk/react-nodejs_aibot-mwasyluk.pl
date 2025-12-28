import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';

/* ============ STYLED COMPONENTS ============ */

const Wrap = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.22);
  }
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Row = styled.div`
  display: flex;
  justify-content: ${({ $role }) => 
    $role === 'user' ? 'flex-end' : 
    $role === 'assistant' ? 'flex-start' : 
    'center'
  };
`;

const Bubble = styled.div`
  max-width: 78%;
  padding: 10px 12px;
  border-radius: 14px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.55;
  font-size: 13px;

  ${({ theme, $role, $status }) => {
    const isUser = $role === 'user';
    const isError = $role === 'error' || $status === 'error';
    const isCancelled = $status === 'cancelled';

    return css`
      background: ${isUser ? theme.colors.primary + '33' : theme.colors.background + '55'};
      border: 1px solid ${isUser ? theme.colors.primary + '55' : theme.colors.border};
      
      ${isError && css`
        background: ${theme.colors.error.background};
        border-color: ${theme.colors.error.default}55;
      `}
      
      ${isCancelled && css`
        opacity: 0.7;
        border-style: dashed;
      `}
    `;
  }}
`;

/**
 * Thinking text - surowy tekst bez tła i wrappera
 * Wąska czcionka, lekko mniejsza niż treść regularnych wiadomości
 */
const ThinkingText = styled.div`
  max-width: 78%;
  padding: 4px 0;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
  font-size: 12px;
  font-weight: 300;
  font-style: italic;
  
  ${({ theme }) => css`
    color: ${theme.colors.text.secondary};
    opacity: 0.7;
  `}
`;

const ThinkingLabel = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 6px;
  
  ${({ theme }) => css`
    color: ${theme.colors.text.secondary};
    opacity: 0.5;
  `}
`;

const Meta = styled.div`
  margin-top: 2px;
  font-size: 11px;
  opacity: 0.65;
  text-align: ${({ $role }) => 
    $role === 'user' ? 'right' : 
    $role === 'assistant' ? 'left' : 
    'center'
  };
`;

const StatusBadge = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
  
  ${({ theme, $status }) => {
    if ($status === 'cancelled') {
      return css`
        background: ${theme.colors.error.background};
        color: ${theme.colors.error.default};
      `;
    }
    if ($status === 'error') {
      return css`
        background: ${theme.colors.error.background};
        color: ${theme.colors.error.default};
      `;
    }
    if ($status === 'thinking' || $status === 'streaming') {
      return css`
        background: ${theme.colors.primary}22;
        color: ${theme.colors.primary};
      `;
    }
    return '';
  }}
`;

const EmptyState = styled.div`
  font-size: 13px;
  opacity: 0.75;
`;

/* ============ HELPERS ============ */

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function getStatusLabel(status, t) {
  switch (status) {
    case 'cancelled':
      return t.messageStatusCancelled || 'Cancelled';
    case 'error':
      return t.messageStatusError || 'Error';
    case 'thinking':
      return t.messageStatusThinking || 'Thinking...';
    case 'streaming':
      return '...';
    default:
      return null;
  }
}

/* ============ COMPONENT ============ */

export default function MessageList({ chatId }) {
  const { state, selectors } = useAppState();
  const { t } = useI18n();
  const messages = useMemo(
    () => selectors.selectMessagesForChat(state, chatId), 
    [state, selectors, chatId]
  );

  if (!messages.length) {
    return (
      <Wrap>
        <EmptyState>
          No messages yet. Type something and pretend it's meaningful.
        </EmptyState>
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
        const displayText = finalText + (showCursor ? '▍' : '');
        const statusLabel = getStatusLabel(status, t);

        return (
          <MessageGroup key={m.id}>
            {/* Thinking text - wyświetlany NAD odpowiedzią, jako osobny blok */}
            {thinkingText && (
              <Row $role={role}>
                <ThinkingText>
                  <ThinkingLabel>💭</ThinkingLabel>
                  {thinkingText}
                </ThinkingText>
              </Row>
            )}
            
            {/* Main message bubble - wyświetlany POD thinking */}
            {(displayText || status === 'thinking') && (
              <Row $role={role}>
                <Bubble $role={role} $status={status}>
                  {displayText || (status === 'thinking' ? '...' : '')}
                </Bubble>
              </Row>
            )}
            
            {/* Metadata */}
            <Meta $role={role}>
              {role}
              {' · '}
              {formatTime(m.createdAt)}
              {statusLabel && (
                <StatusBadge $status={status}>
                  {statusLabel}
                </StatusBadge>
              )}
            </Meta>
          </MessageGroup>
        );
      })}
    </Wrap>
  );
}
