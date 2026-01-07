import { MoreVert, Psychology, Save, Send } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppState } from '../../context/AppStateContext';
import { useI18n } from '../../hooks/useI18n';
import { useToast } from '../../notifications/Toast';
import { llmService } from '../../services/LLMService';
import { alpha } from '../../utils/colorUtils';
import { isValidModelId } from '../../utils/model-util';

/* ============ STYLED COMPONENTS ============ */

const Wrap = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
  background: ${({ theme }) => theme.palette.background.paper};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-radius: 16px;
  padding: 8px;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: ${({ theme }) => theme.palette.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => alpha(theme.palette.primary.main, 0.08)};
  }
`;

const SparkleIcon = styled.span`
  font-size: 18px;
  opacity: 0.7;
  margin-top: 2px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const Input = styled.textarea`
  flex: 1;
  resize: none;
  min-height: 24px;
  max-height: 120px;
  border: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  font-family: inherit;
  color: ${({ theme }) => theme.palette.text.main};

  &::placeholder {
    color: ${({ theme }) => theme.palette.text.secondary};
    opacity: 0.7;
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const LeftActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MoreButton = styled(IconButton)`
  && {
    padding: 6px;
    color: ${({ theme }) => theme.palette.text.secondary};
    
    &:hover {
      background: ${({ theme }) => alpha(theme.palette.primary.main, 0.08)};
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  
  background: ${({ theme, $active }) =>
    $active ? theme.palette.primary.main : 'transparent'};
  border: 1px solid ${({ theme, $active }) =>
    $active ? theme.palette.primary.main : theme.palette.border};
  color: ${({ theme, $active }) =>
    $active ? theme.palette.primary.contrastText : theme.palette.text.main};
  
  &:hover {
    background: ${({ theme, $active }) =>
    $active
      ? (theme.palette.primary.dark || theme.palette.primary.main)
      : alpha(theme.palette.primary.main, 0.08)};
    border-color: ${({ theme, $active }) =>
    $active
      ? (theme.palette.primary.dark || theme.palette.primary.main)
      : theme.palette.primary.main};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const SendButton = styled(IconButton)`
  && {
    width: 44px;
    height: 44px;
    justify-self: start;
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.palette.primary.dark || theme.palette.primary.main};
    }
    
    &:disabled {
      background-color: ${({ theme }) => theme.palette.border};
      color: ${({ theme }) => theme.palette.text.secondary};
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

/* ============ COMPONENT ============ */

/**
 * InputBar - Pole wpisywania wiadomości z opcjami.
 * 
 * Jeśli chatId jest null, wysłanie wiadomości tworzy nowy czat.
 * 
 * @param {Object} props
 * @param {string|null} props.chatId - ID aktualnego czatu lub null
 */
export default function InputBar({ chatId, initialPrompt = '' }) {
  const { state, actions, selectors } = useAppState();
  const { t } = useI18n();
  const { showError, showWarning } = useToast();
  const inputFieldRef = useRef();
  const [text, setText] = useState(initialPrompt || '');
  const [saveLocal, setSaveLocal] = useState(true);
  const [thinking, setThinking] = useState(false);

  const abortRef = useRef(null);

  const send = useCallback(async () => {
    const value = text.trim();
    if (!value) return;

    // stop previous stream for this input instance
    abortRef.current?.abort?.();
    abortRef.current = new AbortController();

    const model = selectors.selectSelectedModel(state);
    if (!isValidModelId(model?.id)) {
      showError(
        t.toastErrorModelNotFound || 'No model selected. Please select a model first.',
        t.toastErrorTitle || 'Error'
      );
      return;
    }

    // Jeśli nie ma aktywnego czatu, tworzymy nowy
    let targetChatId = chatId;
    if (!targetChatId) {
      // Tworzymy nowy czat - tytuł zostanie ustawiony jako początek wiadomości
      const newTitle = value.length > 50 ? value.substring(0, 47) + '...' : value;
      targetChatId = actions.createChat({ title: newTitle });
    }

    // build prompt messages using current state + the message we're about to add
    const currentMsgs = selectors.selectMessagesForChat(state, targetChatId) || [];
    const promptMsgs = [...currentMsgs, { role: 'user', content: { final: value } }];

    actions.addUserMessage(targetChatId, value);
    const assistantId = actions.startAssistantMessage(targetChatId, { modelId: model.id, status: 'thinking' });

    setText('');

    await llmService.streamChat({
      chatId: targetChatId,
      model,
      messages: promptMsgs,
      signal: abortRef.current.signal,
      useThinking: thinking,
      onEvent: (ev) => {
        console.log(ev)
        if (ev.type === 'thinking') {
          if (ev.full != null && ev.full !== '') {
            actions.upsertAssistantMessage(targetChatId, { messageId: assistantId, status: 'thinking', contentThinking: ev.full });
          } else if (ev.delta) {
            actions.appendAssistantThinkingDelta(targetChatId, assistantId, ev.delta);
          }
          return;
        }

        if (ev.type === 'delta') {
          if (ev.full != null && ev.full !== '') {
            actions.upsertAssistantMessage(targetChatId, { messageId: assistantId, status: 'streaming', contentFinal: ev.full });
          } else if (ev.delta) {
            actions.appendAssistantDelta(targetChatId, assistantId, ev.delta);
          }
          return;
        }

        if (ev.type === 'done') {
          actions.finalizeAssistantMessage(targetChatId, assistantId);
          actions.setModelStatus(model.id, 'ok');
          return;
        }

        if (ev.type === 'abort') {
          actions.cancelAssistantMessage(targetChatId, assistantId);
          showWarning(
            t.toastErrorStreamAborted || 'Response generation was cancelled',
            t.toastWarningTitle || 'Cancelled'
          );
          return;
        }

        if (ev.type === 'error') {
          showError(
            ev.message || t.toastErrorStreamInterrupted || 'Streaming error occurred',
            t.toastErrorTitle || 'Error'
          );
          actions.setModelStatus(model.id, 'error');
          actions.cancelAssistantMessage(targetChatId, assistantId);
        }
        return () => {

        }
      },
    });
  }, [actions, chatId, selectors, state, text, thinking, showError, showWarning, t]);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }, [send]);

  // Auto-resize textarea
  const handleChange = useCallback((e) => {
    setText(e.target.value);

    // Auto resize
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
  }, []);

  const toggleSaveLocal = useCallback(() => {
    setSaveLocal(prev => !prev);
  }, []);

  const toggleThinking = useCallback(() => {
    setThinking(prev => !prev);
  }, []);

  const isDisabled = !text.trim();

  useEffect(() => {
    if (!!initialPrompt) {
      setText(initialPrompt + ' ');
      inputFieldRef.current.focus();
    }
  }, [initialPrompt])

  return (
    <Wrap>
      <InputContainer>
        <SparkleIcon>✦</SparkleIcon>
        <Input
          ref={inputFieldRef}
          value={text}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder={t.inputPlaceholder || 'W czym mogę Ci dzisiaj pomóc?'}
          rows={1}
        />

        <SendButton
          onClick={send}
          disabled={isDisabled}
          aria-label={t.inputSend || 'Wyślij'}
        >
          <Send />
        </SendButton>
      </InputContainer>

      <BottomRow>
        <LeftActions>
          <Tooltip disableInteractive title={t.inputMoreOptions || 'Więcej opcji'}>
            <MoreButton size="small">
              <MoreVert />
            </MoreButton>
          </Tooltip>

          <OptionButton
            $active={saveLocal}
            onClick={toggleSaveLocal}
            type="button"
          >
            <Save />
            {t.inputSaveLocal || 'Zapis lokalny'}
          </OptionButton>

          <OptionButton
            $active={thinking}
            onClick={toggleThinking}
            type="button"
          >
            <Psychology />
            {t.inputThinking || 'Myślenie'}
          </OptionButton>
        </LeftActions>
      </BottomRow>
    </Wrap>
  );
}