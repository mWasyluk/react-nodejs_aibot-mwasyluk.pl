import React from 'react';
import styled, { css } from 'styled-components';
import SideMenu from './features/sidebar/SideMenu';
import ChatFrame from './features/chat/ChatFrame';

const Shell = styled.div`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  padding: 16px;
  position: relative;
  overflow: hidden;

  ${({ theme }) => css`
    background: ${theme.palette.background.default};
    
    /* Gradient glow effect for dark theme */
    ${theme.palette.gradientGlow ? css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60%;
        background: ${theme.palette.gradientGlow};
        pointer-events: none;
        z-index: 0;
      }
    ` : ''}
    
    /* Subtle pattern for light theme */
    ${!theme.palette.gradientGlow ? css`
      background-image: 
        radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}08 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, ${theme.palette.primary.main}08 0%, transparent 50%);
    ` : ''}
  `}
`;

const Frame = styled.div`
  width: 100%;
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  gap: 16px;
  position: relative;
  z-index: 1;
`;

export default function App() {
  return (
    <Shell>
      <Frame>
        <SideMenu />
        <ChatFrame />
      </Frame>
    </Shell>
  );
}