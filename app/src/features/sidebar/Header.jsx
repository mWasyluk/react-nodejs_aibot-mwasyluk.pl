import {
    Add,
    ArchiveOutlined,
    Menu,
    MenuOpen,
    Search,
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import styled from 'styled-components';
import { alpha } from '../../utils/colorUtils';

import logoImage from '../../assets/images/logo.png';
import logomarkImage from '../../assets/images/logomark.png';

/* ============ STYLED ============ */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const TopRow = styled.div`
  height: 48px;
  width: 100%;
  display: flex;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'space-between')};
  align-items: center;
`;

const LogoImage = styled.img`
  max-height: 48px;
  height: 48px;
  max-width: 220px;
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
`;

const LogomarkImage = styled.img`
  max-height: 48px;
  height: 48px;
  cursor: pointer;
  display: ${({ $collapsed }) => ($collapsed ? 'block' : 'none')};
`;

const NewChatButton = styled.button`
  width: 100%;
  height: 48px;
  padding: 0 ${({ $collapsed }) => ($collapsed ? '0' : '20px')};
  border-radius: 20px;
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

  &:hover {
    background: ${({ theme }) => alpha(theme.palette.common?.white || '#FFFFFF', 0.5)};
    border-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.25)};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  }
`;

const TabsRow = styled.div`
  display: flex;
  flex-direction: ${({ $collapsed }) => ($collapsed ? 'column' : 'row')};
  gap: 8px;
  align-items: center;
  width: 100%;
`;

const TabButton = styled.button`
  height: 36px;
  border-radius: 20px;
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

  background: ${({ theme, $active }) =>
        $active ? alpha(theme.palette.primary.main, 0.1) : 'transparent'};
  border-color: ${({ theme, $active }) =>
        $active ? alpha(theme.palette.primary.main, 0.1) : 'transparent'};
  color: ${({ theme, $active }) =>
        $active ? theme.palette.primary.main : theme.palette.text.main};

  &:hover {
    background: ${({ theme, $active }) =>
        $active
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(theme.palette.common?.white || '#FFFFFF', 0.5)};
    border-color: ${({ theme, $active }) =>
        $active
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(theme.palette.primary.main, 0.25)};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
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
    const menuIcon = isCollapsed
        ? <Menu sx={{ width: 20, height: 20 }} />
        : <MenuOpen sx={{ width: 20, height: 20 }} />;

    const toggleTooltip = isCollapsed ? t.sideOpenMenuTooltip : t.sideCollapseTooltip;

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
                    <Tooltip disableInteractive title={toggleTooltip}>
                        <IconButton onClick={onToggle} size="small">
                            {menuIcon}
                        </IconButton>
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
                    <Add />
                    <span>{t.sideNewChatButton || 'NOWY CHAT'}</span>
                </NewChatButton>
            </Tooltip>

            {/* Tabs: Search / Archive */}
            <TabsRow $collapsed={isCollapsed}>
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
                        <Search />
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
                        <ArchiveOutlined />
                        <span>{t.sideArchiveButton || 'ARCHIWUM'}</span>
                    </TabButton>
                </Tooltip>
            </TabsRow>
        </Wrap>
    );
}