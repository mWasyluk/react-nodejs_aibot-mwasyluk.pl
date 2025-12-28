import { Send } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import { llmService } from '../../services/LLMService';
import { NOTIFICATIONS } from '../../state/constants';
import { isValidModelId } from '../../utils/model-util';

const Wrap = styled.div`
  padding: 12px 14px 14px;
  display: flex;
  gap: 10px;
  align-items: flex-end;

  ${({ theme }) => css`
    border-top: 1px solid ${theme.colors.border};
    background: ${theme.colors.surface}cc;
  `}
`;

const Input = styled.textarea`
  flex: 1;
  resize: none;
  min-height: 42px;
  max-height: 160px;
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.4;
  outline: none;

  ${({ theme }) => css`
    background: ${theme.colors.background}55;
    border: 1px solid ${theme.colors.border};

    &:focus {
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px ${theme.colors.primary}22;
    }
  `}
`;

const Hint = styled.div`
  font-size: 11px;
  opacity: 0.65;
  padding-left: 2px;
`;

const CustomIconButton = styled(IconButton)`
  align-self: start;
`;

export default function InputBar({ chatId }) {
  const { state, actions, selectors } = useAppState();
  const { t } = useI18n();
  const [text, setText] = useState('');

  const abortRef = useRef(null);

  const send = useCallback(async () => {
    const value = text.trim();
    if (!value) return;

    // stop previous stream for this input instance
    abortRef.current?.abort?.();
    abortRef.current = new AbortController();

    const model = selectors.selectSelectedModel(state);
    if (!isValidModelId(model?.id)) {
      actions.addNotification(chatId, NOTIFICATIONS.ERROR, 'No model selected.');
      return;
    }

    // build prompt messages using current state + the message we’re about to add
    const currentMsgs = selectors.selectMessagesForChat(state, chatId);
    const promptMsgs = [...currentMsgs, { role: 'user', content: { final: value } }];

    actions.addUserMessage(chatId, value);
    const assistantId = actions.startAssistantMessage(chatId, { modelId: model.id, status: 'thinking' });

    setText('');

    await llmService.streamChat({
      chatId,
      model,
      messages: promptMsgs,
      signal: abortRef.current.signal,
      onEvent: (ev) => {
        if (ev.type === 'thinking') {
          if (ev.full != null && ev.full !== '') {
            actions.upsertAssistantMessage(chatId, { messageId: assistantId, status: 'thinking', contentThinking: ev.full });
          } else if (ev.delta) {
            actions.appendAssistantThinkingDelta(chatId, assistantId, ev.delta);
          }
          return;
        }

        if (ev.type === 'delta') {
          if (ev.full != null && ev.full !== '') {
            actions.upsertAssistantMessage(chatId, { messageId: assistantId, status: 'streaming', contentFinal: ev.full });
          } else if (ev.delta) {
            actions.appendAssistantDelta(chatId, assistantId, ev.delta);
          }
          return;
        }

        if (ev.type === 'done') {
          actions.finalizeAssistantMessage(chatId, assistantId);
          actions.setModelStatus(model.id, 'ok');
          return;
        }

        if (ev.type === 'abort') {
          actions.cancelAssistantMessage(chatId, assistantId);
          return;
        }

        if (ev.type === 'error') {
          actions.addNotification(chatId, NOTIFICATIONS.ERROR, ev.message || 'Streaming error');
          actions.setModelStatus(model.id, 'error');
          actions.cancelAssistantMessage(chatId, assistantId);
        }
      },
    });
  }, [actions, chatId, selectors, state, text]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <Wrap>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Write a message…"
        />
        {/* <Hint>Enter to send, Shift+Enter for a new line.</Hint> */}
        <Hint>{t.inputMultilineHint}</Hint>
      </div>

      <CustomIconButton onClick={send} disabled={!text.trim()}>
        <Send />
      </CustomIconButton>
    </Wrap>
  );
}
