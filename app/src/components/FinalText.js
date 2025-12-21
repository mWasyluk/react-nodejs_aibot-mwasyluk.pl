import { useTheme } from "styled-components";
import { useLLM } from "../context/LLMContext";
import { useEffect } from "react";
import MarkdownContent from "./MarkdownContent";

export default function FinalText() {
    const { 
        finalText,
        status
    } = useLLM();
    const theme = useTheme();

    const showContent = status !== "done";

    useEffect(()=> {
        console.log('Reload FinalText. ');
        console.log("text:", finalText);
        console.log("status:", status);
    }, [finalText, status])

    return (
        showContent ? (
            <MarkdownContent className={`message out`}>{finalText}</MarkdownContent>
        ) : (
            <></>
        )
    );
}
