import { IconButton, Tooltip } from '@mui/material';
import styled from 'styled-components';
import { alpha } from '../../utils/colorUtils';

import logoImage from '../../assets/images/logo.png';
import logomarkImage from '../../assets/images/logomark.png';
import { ReactComponent as ArchiveIcon } from '../../assets/svg/archive.svg';
import { ReactComponent as AddChatIcon } from '../../assets/svg/new-chat.svg';
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg';
import { ReactComponent as SideMenuIcon } from '../../assets/svg/side-menu.svg';


/* ============ STYLED ============ */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 100%;
`;

const TopRow = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'left' : 'space-between')};
  align-items: center;
  margin-bottom: 10px;

  svg {
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const CollapseSideMenuButton = styled(IconButton)`
    && {
        transition: all 0.2s ease-out;

        &:hover {
            background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
        }
    
        &:active {
            background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.3)};
        }
    }

`;

const LogoImage = styled.img`
  max-height: 48px;
  height: 48px;
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
`;

const LogomarkImage = styled.img`
  max-height: 48px;
  height: 48px;
  cursor: pointer;
  display: ${({ $collapsed }) => ($collapsed ? 'block' : 'none')};
  justify-self: left;
`;

const NewChatButton = styled.button`
  width: 100%;
  height: 48px;
  padding: 0 ${({ $collapsed }) => ($collapsed ? '0' : '20px')};
  border-radius: 999px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $collapsed }) => ($collapsed ? '0' : '8px')};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.15s ease;
  background: ${({ theme }) => theme.palette.surface};
  color: ${({ theme }) => theme.palette.primary.dark};

  &:hover {
    background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
  }

  &:active {
    background: ${({ theme }) => alpha(theme.palette.primary.main, 0.3)};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.palette.primary.dark};
  }

  span {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  }
`;

const TabButton = styled.button`
  height: 36px;
  border-radius: 10px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  white-space: nowrap;
  padding: 0 ${({ $collapsed }) => ($collapsed ? '8px' : '20px')};
  gap: ${({ $collapsed }) => ($collapsed ? '0' : '6px')};
  width: ${({ $collapsed }) => ($collapsed ? '36px' : 'auto')};
  min-width: ${({ $collapsed }) => ($collapsed ? '36px' : 'auto')};
  width: fit-content;

  background: ${({ theme, $active }) =>
    $active ? alpha(theme.palette.primary.main, 0.2) : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.palette.primary.dark : theme.palette.text.main};

  &:hover {
    background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    color: ${({ theme, $active }) =>
    $active ? theme.palette.primary.main : theme.palette.text.main};
  }

  &:active {
    background: ${({ theme }) => alpha(theme.palette.primary.main, 0.3)};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: ${({ theme, $active }) =>
    $active ? theme.palette.primary.dark : theme.palette.text.main};
  }

  span {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  }
`;

/* ============ COMPONENT ============ */

export default function Header({
  isCollapsed,
  mode,
  onToggle,
  onNewChat,
  onSetMode,
  t,
}) {

  return (
    <Wrap>
      {/* Logo + Toggle */}
      <TopRow $collapsed={isCollapsed}>
        <LogoImage src={logoImage} $collapsed={isCollapsed} />
        <LogomarkImage
          src={logomarkImage}
          $collapsed={isCollapsed}
          onClick={onToggle}
        />
        {!isCollapsed && (
          <Tooltip disableInteractive title={t.sideCollapseTooltip}>
            <CollapseSideMenuButton onClick={onToggle} size="small" disableTouchRipple>
              <SideMenuIcon />
            </CollapseSideMenuButton>
          </Tooltip>
        )}
      </TopRow>

      {/* New Chat Button */}
      <Tooltip
        disableInteractive
        title={isCollapsed ? t.sideNewChatTooltip : ''}
        placement="right"
      >
        <NewChatButton onClick={onNewChat} type="button" $collapsed={isCollapsed}>
          <AddChatIcon />
          {/* <AddChatIcon /> */}
          {/* </AddChatIconWrap> */}
          <span>{t.sideNewChatButton || 'NOWY CHAT'}</span>
        </NewChatButton>
      </Tooltip>

      {/* Tabs: Search / Archive */}
      <Tooltip
        disableInteractive
        title={isCollapsed ? t.sideSearchTooltip : ''}
        placement="right"
      >
        <TabButton
          $active={mode === 'search'}
          $collapsed={isCollapsed}
          onClick={() => onSetMode('search')}
          type="button"
        >
          <SearchIcon />
          <span>{t.sideSearchButton || 'SZUKAJ'}</span>
        </TabButton>
      </Tooltip>

      <Tooltip
        disableInteractive
        title={isCollapsed ? t.sideArchiveTooltip : ''}
        placement="right"
      >
        <TabButton
          $active={mode === 'archive'}
          $collapsed={isCollapsed}
          onClick={() => onSetMode('archive')}
          type="button"
        >
          <ArchiveIcon />
          <span>{t.sideArchiveButton || 'ARCHIWUM'}</span>
        </TabButton>
      </Tooltip>
    </Wrap>
  );
}