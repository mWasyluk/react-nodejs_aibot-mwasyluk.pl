import { STREAM_URL } from '../utils/api-util';

/**
 * @typedef {Object} LlmStreamEvent
 * @property {'thinking'|'delta'|'done'|'error'|'abort'} type
 * @property {string=} delta
 * @property {string=} full
 * @property {string=} message
 */

/**
 * Minimalny serwis do streamingu SSE z backendu.
 * - nie trzyma stanu UI
 * - emituje eventy do callbacka
 */
export class LLMService {
    /**
     * @param {{
     *  chatId: string,
     *  model: {id: string, label?: string, provider?: string, runtimeId?: string},
     *  messages: Array<{role: string, content?: {final?: string, thinking?: string}}>,
     *  onEvent: (ev: LlmStreamEvent) => void,
     *  signal?: AbortSignal
     * }} params
     */
    async streamChat({ chatId, model, messages, onEvent, signal }) {
        if (!chatId) throw new Error('chatId required');
        if (model?.id !== 0 && !model?.id) throw new Error('model required');

        const prompt = this.buildPrompt(messages);

        let response;
        try {
            response = await fetch(STREAM_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, model: { id: model.id } }),
                signal,
            });
        } catch (e) {
            if (e?.name === 'AbortError') {
                onEvent?.({ type: 'abort' });
                return;
            }
            onEvent?.({ type: 'error', message: e?.message || 'Network error' });
            return;
        }

        if (!response.ok || !response.body) {
            onEvent?.({ type: 'error', message: `HTTP ${response.status}` });
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        let buffer = '';

        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                let sepIndex;
                while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
                    const rawEvent = buffer.slice(0, sepIndex);
                    buffer = buffer.slice(sepIndex + 2);

                    if (!rawEvent.trim()) continue;

                    // SSE: może mieć linie "event:" i "data:"
                    let eventType = 'message';
                    let dataLine = '';

                    for (const line of rawEvent.split('\n')) {
                        if (line.startsWith('event:')) eventType = line.slice(6).trim();
                        if (line.startsWith('data:')) dataLine += line.slice(5).trim();
                    }

                    if (eventType === 'done') {
                        onEvent?.({ type: 'done' });
                        continue;
                    }

                    if (!dataLine) continue;

                    let payload;
                    try {
                        payload = JSON.parse(dataLine);
                    } catch {
                        continue;
                    }

                    if (eventType === 'error' || payload?.type === 'error') {
                        onEvent?.({ type: 'error', message: payload?.full || payload?.message || 'Streaming error' });
                        continue;
                    }

                    const logicalType = payload?.type || eventType; // thinking/final
                    const delta = payload?.delta ?? '';
                    const full = payload?.full;

                    if (logicalType === 'thinking') {
                        onEvent?.({ type: 'thinking', delta, full });
                        continue;
                    }

                    if (logicalType === 'final') {
                        onEvent?.({ type: 'delta', delta, full });
                        if (payload?.done === true) onEvent?.({ type: 'done' });
                        continue;
                    }
                }
            }
        } catch (e) {
            if (e?.name === 'AbortError') {
                onEvent?.({ type: 'abort' });
                return;
            }
            onEvent?.({ type: 'error', message: e?.message || 'Stream read error' });
        }
    }

    /**
     * Prosty prompt-builder: zamienia listę wiadomości na jeden string
     * backend na razie przyjmuje "prompt" jako string.
     */
    buildPrompt(messages = []) {
        const lines = [];
        for (const m of messages) {
            const role = m?.role === 'user' ? 'User' : m?.role === 'assistant' ? 'Assistant' : 'System';
            const text = m?.content?.final ?? '';
            if (!text) continue;
            lines.push(`${role}: ${text}`);
        }
        return lines.join('\n');
    }
}

export const llmService = new LLMService();
