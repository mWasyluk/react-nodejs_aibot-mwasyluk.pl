import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const MarkdownContent = styled(ReactMarkdown)`
  color: ${({ theme }) => theme.palette.text.main};
  
  & p {
    margin-top: 0;
    margin-bottom: 0.5em;
  }
  
  & h1, & h2, & h3, & h4, & h5, & h6 {
    margin-top: 1em;
    margin-bottom: 0.5em;
    color: ${({ theme }) => theme.palette.text.main};
  }
  
  & ul, & ol {
    margin-left: 1em;
  }
  
  & code {
    padding: 0 4px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.palette.codeBackground};
    color: ${({ theme }) => theme.palette.text.main};
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.9em;
  }
  
  & pre {
    border-radius: 4px;
    padding: 12px;
    overflow-x: auto;
    background-color: ${({ theme }) => theme.palette.codeBackground};
    
    & code {
      padding: 0;
      background: none;
    }
  }
  
  & blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 3px solid ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.text.secondary};
  }
  
  & a {
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  & hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
    margin: 1.5em 0;
  }
  
  & table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  
  & th, & td {
    border: 1px solid ${({ theme }) => theme.palette.border};
    padding: 8px 12px;
    text-align: left;
  }
  
  & th {
    background-color: ${({ theme }) => theme.palette.surfaceAlt};
    font-weight: 600;
  }
`;

export default MarkdownContent;