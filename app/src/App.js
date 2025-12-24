import React from 'react';
import styled, { css } from 'styled-components';
import SideMenu from './features/sidebar/SideMenu';
import ChatFrame from './features/chat/ChatFrame';
import { cubicBackground } from './styles/background';

const Shell = styled.div`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  padding: 16px;

  ${({ theme }) => css`
    background-color: ${theme.colors.background};

    & * {
      color: ${theme.colors.text.primary};
    }

    /* Subtelny "papier" w tle jak na screenach */
    ${theme.colors.text.primary === '#FFFFFF'
            ? css`
          --c1: #2d2d2d;
          --c2: #000000;
          --c3: #161616;
        `
            : css`
          --c1: #b2b2b2;
          --c2: #ffffff;
          --c3: #d9d9d9;
        `}
    --s: 132px;
    ${cubicBackground};
  `}
`;

const Frame = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  gap: 16px;

  ${({ theme }) => css`
    border-radius: 18px;
  `}
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
