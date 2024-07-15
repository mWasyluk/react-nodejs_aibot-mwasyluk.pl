import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import useFetch from "../hooks/useFetch";
import { prepareContextPrompt } from "../utils/prompt-util";
import MarkdownContent from "./MarkdownContent";
import SendMessageButton from "./SendMessageButton";
import { QUERY_URL } from "../utils/api-util";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 16px;

    overflow: hidden;
`;

const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column-reverse;
    gap: 16px;

    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    & .message {
        max-width: 90%;
        padding: 8px;
        border-radius: 8px;
    }

    & .message.in {
        align-self: flex-end;
        margin-left: 20px;
        background-color: ${({theme}) => theme.colors.primary};
        color: ${({theme}) => theme.colors.text.primary};
    }
    
    & .message.out {
        align-self: flex-start;
        margin-right: 20px;
        background-color: ${({theme}) => theme.colors.secondary};
        color: ${({theme}) => theme.colors.text.secondary};
    }

    & .message.err {
        align-self: center;
        max-width: 90%;
        background-color: ${({theme}) => theme.colors.background};
        color: ${({theme}) => theme.colors.text.secondary};
    }
`;

const Row = styled.div`
    display: flex;
    gap: 8px;
    height: fit-content;
`;

function Chat(props) {
    const { model } = props;
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const theme = useTheme();

    const { data, isLoading, error, fetchData } = useFetch();

    function addMessage(message){
        setMessages(prev => [message, ...prev]);
    }

    const handleSend = async () => {
        const content = input.trim();
        if (!content && content !== 0 ){
            return; 
        }
        const source = 'in';
    
        addMessage({content, source});
        setInput(""); 
    
        const newPrompt = prepareContextPrompt(content, messages);
        const url = QUERY_URL;
        
        const method = 'POST';
        const body = { prompt: newPrompt, model };

        fetchData({url, method, body});
    }

    useEffect(() => {
        if (data && !isLoading) {
            addMessage({content: data, source: 'out'});
        } else if (error) {
            addMessage({content: error, source: 'err'});
        }
    }, [data, isLoading, error]);
    
    return (
        <Container>
            <MessagesContainer>
                <div className={`message loading`}></div>
                {messages.map((message, i) => <MarkdownContent key={i} className={`message ${message.source}`}>{message.content}</MarkdownContent>)}
            </MessagesContainer>
            <Row>
                <TextField
                    id="standard-textarea"
                    placeholder="Ask your question here..."
                    multiline
                    maxRows={6}
                    fullWidth 
                    variant="standard"
                    value={input}
                    onChange={(nv) => {setInput(nv.target.value)}}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    sx={{
                        '& .MuiInputBase-input': {
                            color: theme.colors.text.primary,
                        },
                        '& .MuiInput-underline:before': { 
                            borderBottomColor: theme.colors.text.primary
                        },
                        '& .MuiInput-underline:after': { 
                            borderBottomColor: theme.colors.text.primary 
                        },
                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { 
                            borderBottomColor: theme.colors.text.secondary 
                        },
                    }}
                />
                <SendMessageButton onClick={handleSend}></SendMessageButton>
            </Row>
        </Container>
    );
}

export default Chat;
