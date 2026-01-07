import { Person } from '@mui/icons-material';
import styled from 'styled-components';
import { alpha } from '../../utils/colorUtils';

/* ============ STYLED ============ */

const Wrap = styled.div`
  width: 100%;
  height: ${({ $collapsed }) => ($collapsed ? '52px' : '64px')};
  padding: ${({ $collapsed }) => ($collapsed ? '0' : '0 16px 0 0')};
  border-radius: ${({ $collapsed }) => ($collapsed ? '50%' : '999px')};
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: ${({ $collapsed }) => ($collapsed ? '0' : '12px')};
  background: ${({ theme }) => theme.palette.surface};
  border: 1px solid ${({ theme }) => theme.palette.border};
`;

const Avatar = styled.div`
  width: ${({ $collapsed }) => ($collapsed ? '52px' : '64px')};
  height: ${({ $collapsed }) => ($collapsed ? '52px' : '64px')};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => alpha(theme.palette.primary.main, 0.13)};
  color: ${({ theme }) => theme.palette.primary.main};
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
`;

const Hint = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.6;
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