import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import { alpha } from '../../utils/colorUtils';
import MarkdownContent from './MarkdownContent';

/* ============ STYLED COMPONENTS ============ */

const Wrap = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${({ theme }) => alpha(theme.palette.text.main, 0.22)};
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
  color: ${({ theme }) => theme.palette.text.main};

  ${({ theme, $role, $status }) => {
    const isUser = $role === 'user';
    const isError = $role === 'error' || $status === 'error';
    const isCancelled = $status === 'cancelled';

    // Domyślne style
    let background = isUser
      ? alpha(theme.palette.primary.main, 0.2)
      : alpha(theme.palette.background.main, 0.55);
    let borderColor = isUser
      ? alpha(theme.palette.primary.main, 0.33)
      : theme.palette.border;

    // Style dla błędów
    if (isError) {
      background = theme.palette.error.light;
      borderColor = alpha(theme.palette.error.main, 0.33);
    }

    return css`
      background: ${background};
      border: 1px solid ${borderColor};
      
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
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.7;
`;

const ThinkingLabel = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 6px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.5;
`;

const Meta = styled.div`
  margin-top: 2px;
  font-size: 11px;
  color: ${({ theme }) => theme.palette.text.secondary};
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
    if ($status === 'cancelled' || $status === 'error') {
      return css`
        background: ${theme.palette.error.light};
        color: ${theme.palette.error.main};
      `;
    }
    if ($status === 'thinking' || $status === 'streaming') {
      return css`
        background: ${alpha(theme.palette.primary.main, 0.13)};
        color: ${theme.palette.primary.main};
      `;
    }
    return '';
  }}
`;

const EmptyState = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.text.secondary};
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
          {t.messageListEmpty || 'No messages yet. Type something and pretend it\'s meaningful.'}
        </EmptyState>
      </Wrap>
    );
  }

  console.log("messages", messages, "chatId", state.chats.currentChatId)

  return (
    <Wrap>
      {messages.map((m) => {
        const role = m.role || 'assistant';
        const status = m.status || 'done';
        const finalText = m?.content?.final ?? '';
        const thinkingText = m?.content?.thinking ?? '';
        const showCursor = status === 'streaming';
        const displayText = finalText + (showCursor ? '▌' : '');
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
                  <MarkdownContent>
                    {displayText || (status === 'thinking' ? '...' : '')}
                  </MarkdownContent>
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