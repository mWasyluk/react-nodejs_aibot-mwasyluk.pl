import { Person } from '@mui/icons-material';
import styled from 'styled-components';

/* ============ STYLED ============ */

const Wrap = styled.div`
  width: 100%;
  padding: ${({ $collapsed }) => ($collapsed ? '5px 2px' : '5px')};
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ $collapsed }) => ($collapsed ? '0' : '12px')};
  background: ${({ theme }) => theme.palette.background.paper};
  transition: padding 0.2s ease-in-out;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.background.main};
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Info = styled.div`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.text.main};
  overflow: hidden;
  white-space: nowrap;
`;

const Hint = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.6;
  overflow: hidden;
  white-space: nowrap;
`;

/* ============ COMPONENT ============ */

export default function UserCard({ isCollapsed, t }) {
  return (
    <Wrap $collapsed={isCollapsed}>
      <Avatar $collapsed={isCollapsed}>
        <Person />
      </Avatar>
      <Info $collapsed={isCollapsed}>
        <UserName>{t.sideUserAnonymousTitle || 'Anonimowy Użytkownik'}</UserName>
        <Hint>{t.sideUserLocalData}</Hint>
      </Info>
    </Wrap>
  );
}