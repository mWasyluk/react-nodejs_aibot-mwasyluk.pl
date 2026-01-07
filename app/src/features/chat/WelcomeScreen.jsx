import { Language } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import logomarkImage from '../../assets/images/logomark.png';
import { useI18n } from '../../hooks/useI18n';
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

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
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
  color: ${({ theme }) => theme.palette.text.main};
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
      <Avatar src={logomarkImage} />

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