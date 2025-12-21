import { useTheme } from "styled-components";
import { useLLM } from "../context/LLMContext";
import { useEffect } from "react";

export default function ThinkingText() {
    const { 
        thinkingText,
        status
    } = useLLM();
    const theme = useTheme();

    const showContent = !!thinkingText && (status === "streaming");
    const showIcon = !!thinkingText && (status === "streaming")

    useEffect(()=> {
        console.log('Reload ThinkingText. ');
        console.log("text:", thinkingText);
        console.log("status:", status);
    }, [thinkingText, status])

    return (
        showContent ? (
            <div style={{opacity: 0.5}}>{thinkingText}</div>
        ) : (
            <></>
        )
    );
}
