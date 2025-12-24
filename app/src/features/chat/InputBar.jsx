import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { Send } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useAppState } from '../../context/AppStateContext';

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

export default function InputBar({ chatId }) {
  const { actions } = useAppState();
  const [text, setText] = useState('');

  const send = useCallback(() => {
    const value = text.trim();
    if (!value) return;
    actions.addUserMessage(chatId, value);
    setText('');
  }, [actions, chatId, text]);

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
        <Hint>Enter to send, Shift+Enter for a new line.</Hint>
      </div>

      <IconButton onClick={send} disabled={!text.trim()}>
        <Send />
      </IconButton>
    </Wrap>
  );
}
