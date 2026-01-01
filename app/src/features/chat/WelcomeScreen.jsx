import { Language } from '@mui/icons-material';
import styled from 'styled-components';
import { useI18n } from '../../hooks/useI18n';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { alpha } from '../../utils/colorUtils';

/* ============ STYLED COMPONENTS ============ */

const Wrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
  overflow: auto;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  /* Glitch/distortion effect like in the design */
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.primary.main};
    opacity: 0.2;
    filter: blur(20px);
  }
`;

const AvatarInner = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark || theme.palette.primary.main} 100%)`};
  box-shadow: ${({ theme }) => `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}, inset 0 -2px 10px rgba(0,0,0,0.2)`};
  
  /* Face-like design from screenshot */
  &::before {
    content: '';
    position: absolute;
    width: 60%;
    height: 8px;
    top: 40%;
    left: 20%;
    border-radius: 4px;
    background: ${({ theme }) => theme.palette.primary.contrastText};
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 30%;
    height: 6px;
    bottom: 35%;
    left: 35%;
    border-radius: 3px;
    background: ${({ theme }) => theme.palette.primary.contrastText};
    opacity: 0.7;
  }
`;

const Greeting = styled.div`
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const UserName = styled.span`
  font-weight: 700;
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.primary};
  line-height: 1.3;
`;

const Subtitle = styled.p`
  margin: 0 0 32px 0;
  max-width: 440px;
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.secondary};
  line-height: 1.6;
`;

const ActionsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 560px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: transparent;
  border: 1px solid ${({ theme }) => alpha(theme.palette.primary.main, 0.3)};
  color: ${({ theme }) => theme.palette.primary.main};
  
  &:hover {
    background: ${({ theme }) => theme.palette.primary.main};
    border-color: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const GlobeIcon = styled(Language)`
  && {
    color: inherit;
  }
`;

/* ============ COMPONENT ============ */

/**
 * WelcomeScreen - Ekran powitalny wyświetlany gdy nie ma aktywnego czatu.
 * 
 * @param {Object} props
 * @param {function} [props.onActionClick] - Callback wywoływany po kliknięciu akcji szybkiej
 * @param {string} [props.userName] - Nazwa użytkownika do wyświetlenia
 */


export default function WelcomeScreen({ onActionClick, userName = 'Anonimowy' }) {
  const { t } = useI18n();

  const quickActions = useMemo(() => [
    { id: 'riddle', label: t.welcomeActionRiddle || 'Wymyśl zagadkę logiczną' },
    { id: 'answer', label: t.welcomeActionAnswer || 'Odpowiedz na zagadkę' },
    { id: 'code', label: t.welcomeActionCode || 'Napisz kod' },
    { id: 'story', label: t.welcomeActionStory || 'Napisz opowiadanie' },
    { id: 'plan', label: t.welcomeActionPlan || 'Przygotuj plan działania' },
    { id: 'analyze', label: t.welcomeActionAnalyze || 'Przeanalizuj temat' },
  ], [t]);

  const handleActionClick = useCallback((actionId) => {
    if (onActionClick) {
      onActionClick(actionId);
    }
  }, [onActionClick]);

  return (
    <Wrap>
      <Avatar>
        <AvatarInner />
      </Avatar>

      <Greeting>
        {t.welcomeGreeting || 'Witaj,'} <UserName>{userName}</UserName>
      </Greeting>

      <Title>{t.welcomeTitle || 'Od czego zaczniemy tym razem?'}</Title>

      <Subtitle>
        {t.welcomeSubtitle || 'Wybierz jedną z opcji, aby rozpocząć czat od zdefiniowanej akcji, lub wpisz swoją własną komendę w oknie poniżej.'}
      </Subtitle>

      <ActionsGrid>
        {quickActions.map((action) => (
          <ActionButton
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            type="button"
          >
            <GlobeIcon />
            {action.label}
          </ActionButton>
        ))}
      </ActionsGrid>
    </Wrap>
  );
}