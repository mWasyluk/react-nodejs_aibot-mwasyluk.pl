import styled, { css } from "styled-components";
import ReactMarkdown from 'react-markdown';

const MarkdownContent = styled(ReactMarkdown)`
  & p {
    margin-top: 0px;
    margin-bottom: 0.5em;
  }
  & h1, & h2, & h3, & h4, & h5, & h6 {
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
  & ul, & ol {
    margin-left: 1em;
  }
  & code {
    padding: 0 4px;
    border-radius: 4px;
  }
  & pre {
    border-radius: 4px;
    padding: 0 4px;
    overflow-x: auto;
  }
  & code, & pre {
    ${({theme}) => css`
      background-color: ${theme.colors.codeBackground};
      color: ${theme.colors.text.secondary};
    `}
  }
`;

export default MarkdownContent;