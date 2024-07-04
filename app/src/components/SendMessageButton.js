import React from 'react';
import { IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const SendMessageButton = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      aria-label="send message"
      size='small'
    >
      <SendIcon fontSize='small'/>
    </IconButton>
  );
};

export default SendMessageButton;
