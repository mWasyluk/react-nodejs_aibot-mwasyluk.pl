import styled from 'styled-components';

/* ============ STYLED ============ */

const Wrap = styled.div`
  display: flex;
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

const d = new Date();
let year = d.getFullYear();

export default function Footer({ isCollapsed, t }) {
  return (
    <Wrap $collapsed={isCollapsed}>
      <span>v.{process.env.REACT_APP_VERSION}</span>
      {!isCollapsed && (<>©{year}<a href="www.mwasyluk.pl">mwasyluk.pl</a></>)}
    </Wrap>
  );
}