export function prepareContextPrompt(prompt, messages) {
    const contextMessages = [...messages]
        .reverse()
        .filter(m => m.soruce !== 'err')
        .map(m => `${m.source === 'in' ? 'Me' : 'You'}: ${m.content}`)
        .join('\n');

    return `You are an AI assistant engaged in a conversation with me. Here's the conversation history with division into roles: ${contextMessages}.
    Now, respond to the following message: "${prompt}" with the following guidelines: 
    * Answer the current question or respond to the current statement directly.
    * Only refer to previous context if it's directly relevant to the current message.
    * If the current message is not related to previous context, treat it as a new topic.
    * Always deduce the language to use from the message you're responding to.
    * Be concise and to the point, but keep the conversation going.
    * If you're unsure about something mentioned in the conversation history, it's okay to ask for clarification, but try to infer my intentions and delve deeper into the topic.
    * Never lie, if you do not know the answer for a question, it's okay to admit it and explain the reason for that.
    * If asked about something you said earlier, refer back to your exact words in the conversation history.
    * Carefully review the conversation history to ensure your answer is consistent with previous statements.
    * Never mention the guidelines or the conversation history if it does not exist.
    Your reply: `;
}
