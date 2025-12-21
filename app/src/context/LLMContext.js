// src/context/LLMContext.js
import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useCallback,
    useEffect,
} from "react";

const LLMContext = createContext(null);

const initialState = {
    thinkingText: "",
    finalText: "",
    status: "idle", // idle | streaming | done | error | cancelled
    error: null,
    model: null,
};

export function LLMProvider({ children, apiBaseUrl = "/api" }) {
    const [thinkingText, setThinkingText] = useState(initialState.thinkingText);
    const [finalText, setFinalText] = useState(initialState.finalText);
    const [status, setStatus] = useState(initialState.status);
    const [error, setError] = useState(initialState.error);
    const [model, setModel] = useState(initialState.model);
    
    // do przerywania streamu
    const abortControllerRef = useRef(null);
    const currentRequestIdRef = useRef(0);
    
    const resetStateForNewStream = useCallback(() => {
        setThinkingText("");
        setFinalText("");
        setError(null);
        setStatus("streaming");
    }, []);

    function yieldToUI() {
        return new Promise((resolve) => setTimeout(resolve, 0));
    }
    
    const stopStream = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        currentRequestIdRef.current += 1; // unieważnij stary stream
        setStatus((prev) => (prev === "streaming" ? "cancelled" : prev));
    }, []);
    
    const startStream = useCallback(
        async (prompt) => {
            if (!model) {
                setError("No model selected.");
                setStatus("error");
                return;
            }
            
            // przerwij ewentualny poprzedni stream
            stopStream();
            
            resetStateForNewStream();
            
            const requestId = currentRequestIdRef.current + 1;
            currentRequestIdRef.current = requestId;
            
            const controller = new AbortController();
            abortControllerRef.current = controller;
            
            try {
                const response = await fetch(`${apiBaseUrl}/stream`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt,
                        model, // wysyłasz cały obiekt { id: ... } tak jak backend oczekuje
                    }),
                    signal: controller.signal,
                });
                
                console.log(response)
                
                if (!response.ok) {
                    // backend przy invalid model robi 400 + SSE, więc tu może być mały rozjazd.
                    // Dla bezpieczeństwa: jeżeli nie ma body stream, rzucamy błąd HTTP.
                    throw new Error(`HTTP error: ${response.status}`);
                }
                
                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                
                let buffer = "";
                let accumulatedFinal = "";
                let accumulatedThinking = "";

                let eventsProcessed = 0;
                
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    
                    // jeżeli w międzyczasie unieważniono request
                    if (requestId !== currentRequestIdRef.current) {
                        // ktoś odpalił nowy stream; nie psujemy mu zabawy
                        break;
                    }
                    
                    buffer += decoder.decode(value, { stream: true });
                    
                    // SSE eventy są rozdzielone pustą linią "\n\n"
                    let sepIndex;
                    // parsujemy wszystkie kompletne eventy dostępne w bufferze
                    while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
                        const rawEvent = buffer.slice(0, sepIndex);
                        buffer = buffer.slice(sepIndex + 2);
                        
                        const lines = rawEvent.split("\n");
                        let eventType = "message"; // domyślny typ eventu SSE
                        const dataLines = [];
                        
                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (trimmed.startsWith("event:")) {
                                eventType = trimmed.slice("event:".length).trim();
                            } else if (trimmed.startsWith("data:")) {
                                dataLines.push(trimmed.slice("data:".length).trim());
                            }
                        }

                        // console.log("dataLines:", dataLines);
                        
                        if (dataLines.length === 0) continue;
                        
                        const dataStr = dataLines.join("\n");
                        let payload;
                        try {
                            payload = JSON.parse(dataStr);
                        } catch (e) {
                            console.error("Failed to parse SSE data JSON:", dataStr);
                            continue;
                        }

                        // console.log("payload:", payload);
                        
                        // 1. Obsługa błędów po nazwie eventu LUB typie w payload
                        if (eventType === "error" || payload.type === "error") {
                            setError(payload.full || payload.message || "Unknown streaming error");
                            setStatus("error");
                            abortControllerRef.current?.abort();
                            return;
                        }
                        
                        // 2. Event "done" (jeśli używasz osobnego eventu)
                        if (eventType === "done") {
                            setStatus((prev) => ((prev === "streaming" || prev === "answering") ? "done" : prev));
                            break;
                        }
                        
                        // 3. Ustal LOGICZNY typ eventu
                        const logicalType = payload.type || eventType; // <── TU CAŁA MAGIA
                        
                        const delta = payload.delta ?? "";
                        const full = payload.full;
                        const chunkDone = payload.done === true;

                        console.log({logicalType, delta, full, chunkDone});
                        
                        // 4. Thinking
                        if (logicalType === "thinking") {
                            console.log("thinking recognized...")
                            // budujemy tekst po kawałkach
                            if (full && full !== "") {
                                accumulatedThinking = full;
                            } else {
                                accumulatedThinking += delta;
                            }
                            console.log("Setting thinkingText to:", accumulatedThinking)
                            setThinkingText(accumulatedThinking);
                        }
                        
                        // 5. Final
                        if (logicalType === "final") {
                            console.log("final recognized...")
                            setStatus("answering");

                            if (full != null && full !== "") {
                                accumulatedFinal = full;
                            } else {
                                accumulatedFinal += delta;
                            }
                            console.log("Setting finalText to:", accumulatedFinal)
                            setFinalText(accumulatedFinal);
                            
                            if (chunkDone) {
                                setStatus("done");
                            }
                        }

                        eventsProcessed++;
                        if (eventsProcessed % 5 === 0) {
                            await yieldToUI();
                        }
                    }
                }
                
                // jeżeli wyszliśmy z pętli readera bez statusu error/cancelled
                setStatus((prev) =>
                    prev === "streaming" || prev === "answering" || prev === "idle" ? "done" : prev
            );
        } catch (err) {
            if (controller.signal.aborted) {
                // stopStream już ustawił status na cancelled
                return;
            }
            console.error("Streaming error:", err);
            setError(err.message || "Unknown streaming error");
            setStatus("error");
        } finally {
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }
    },
    [apiBaseUrl, model, resetStateForNewStream, stopStream]
);

useEffect(() => {
  console.log("[LLMProvider] thinkingText changed:", thinkingText);
}, [thinkingText]);

const value = {
    thinkingText,
    finalText,
    status,
    error,
    // allModels,
    model,
    setModel, // np. wywołasz w ModelSelector
    startStream,
    stopStream,
};

return <LLMContext.Provider value={value}>{children}</LLMContext.Provider>;
}

// Twój hook używany w komponentach
export function useLLM() {
    const ctx = useContext(LLMContext);
    if (!ctx) {
        throw new Error("useLLM must be used within an LLMProvider");
    }
    return ctx;
}

//   const {
//     thinkingText,
//     finalText,
//     status,
//     error,
//     startStream,
//     stopStream,
//     model,
//     setModel,
//   } = useLLM();
