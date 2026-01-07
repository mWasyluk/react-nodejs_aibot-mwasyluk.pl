import styled from 'styled-components';

/* ============ STYLED ============ */

const Wrap = styled.div`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'flex')};
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.palette.text.secondary};
  opacity: 0.5;
  
  a {
    color: inherit;
    text-decoration: underline;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

/* ============ COMPONENT ============ */

export default function Footer({ isCollapsed, t }) {
    return (
        <Wrap $collapsed={isCollapsed}>
            <a href="/docs">{t.sideTermsLink || 'Regulamin'}</a>
            <span>i</span>
            <a href="/docs">{t.sidePrivacyLink || 'polityka prywatności'}</a>
        </Wrap>
    );
}