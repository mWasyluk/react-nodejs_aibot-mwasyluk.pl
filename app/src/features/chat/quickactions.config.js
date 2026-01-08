export const QUICK_ACTIONS = [
    { id: 'surprise', iconId: 'surprise', labelKey: 'welcomeActionSurprise', promptKey: 'promptSurprise' },
    { id: 'teach', iconId: 'teach', labelKey: 'welcomeActionTeach', promptKey: 'promptTeach' },
    { id: 'challenge', iconId: 'challenge', labelKey: 'welcomeActionChallenge', promptKey: 'promptChallenge' },
    { id: 'whatif', iconId: 'whatif', labelKey: 'welcomeActionWhatIf', promptKey: 'promptWhatIf' },
    { id: 'connect', iconId: 'connect', labelKey: 'welcomeActionConnect', promptKey: 'promptConnect' },
];

export const getActionLabel = (action, t) => {
    const label = t[action.labelKey];
    if (!label) {
        console.warn(`Missing translation: ${action.labelKey}`);
        return `[${action.labelKey}]`;
    }
    return label;
};

export const getActionPrompt = (action, t) => {
    const prompt = t[action.promptKey];
    if (!prompt) {
        console.warn(`Missing translation: ${action.promptKey}`);
        return '';
    }
    return prompt;
};

export const getActionById = (actionId) => {
    return QUICK_ACTIONS.find((a) => a.id === actionId);
};