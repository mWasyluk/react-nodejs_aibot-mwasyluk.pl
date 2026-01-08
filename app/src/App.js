import styled from 'styled-components';
import ChatFrame from './features/chat/ChatFrame';
import SideMenu from './features/sidebar/SideMenu';
import { alpha } from './utils/colorUtils';

const Shell = styled.div`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.palette.background.main};
`;

const Frame = styled.div`
  width: 100%;
  // max-width: 1400px;
  height: 100%;
  display: flex;
  gap: 16px;
  position: relative;
  z-index: 1;
  padding: 10px;
  background: 
    /* Duży niebieski - prawy górny (wychodzi poza krawędź) */
    radial-gradient(
      ellipse 28% 28% at 95% 18%,
      ${({ theme }) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.7 : 0.85)} 0%,
      ${({ theme }) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.25 : 0.35)} 45%,
      transparent 70%
    ),
    /* Mały niebieski - prawy górny */
    radial-gradient(
      circle at 85% 38%,
      ${({ theme }) => alpha(theme.palette.primary.dark, theme.palette.mode === 'dark' ? 0.7 : 0.85)} 0%,
      ${({ theme }) => alpha(theme.palette.primary.dark, theme.palette.mode === 'dark' ? 0.25 : 0.35)} 10%,
      transparent 25%
    ),
    /* Fioletowy górny - lewy-środek */
    radial-gradient(
      circle at 32% 28%,
      ${({ theme }) => alpha(theme.palette.accent.dark, theme.palette.mode === 'dark' ? 0.6 : 0.7)} 0%,
      ${({ theme }) => alpha(theme.palette.accent.dark, theme.palette.mode === 'dark' ? 0.15 : 0.2)} 18%,
      transparent 32%
    ),
    /* Fioletowy lewy górny */
    radial-gradient(
      circle at -5% 10%,
      ${({ theme }) => alpha(theme.palette.accent.dark, theme.palette.mode === 'dark' ? 0.5 : 0.3)} 0%,
      ${({ theme }) => alpha(theme.palette.accent.dark, theme.palette.mode === 'dark' ? 0.25 : 0.2)} 15%,
      transparent 32%
    ),
    /* Jasnoniebieski - lewy dolny (wychodzi poza krawędź) */
    radial-gradient(
      circle at 8% 82%,
      ${({ theme }) => alpha(theme.palette.primary.light, theme.palette.mode === 'dark' ? 0.5 : 0.6)} 0%,
      ${({ theme }) => alpha(theme.palette.primary.light, theme.palette.mode === 'dark' ? 0.12 : 0.18)} 15%,
      transparent 28%
    ),
    /* Fioletowy dolny - środek */
    radial-gradient(
      circle at 62% 64%,
      ${({ theme }) => alpha(theme.palette.accent.main, theme.palette.mode === 'dark' ? 0.5 : 0.55)} 0%,
      ${({ theme }) => alpha(theme.palette.accent.main, theme.palette.mode === 'dark' ? 0.1 : 0.15)} 14%,
      transparent 26%
    );
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