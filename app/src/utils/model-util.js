export const isValidModelId = (id) => {
    const isValid = parseInt(id, 10) >= 0;
    if (!isValid) {
        console.debug(`[Model Util] Id "${id}" is not a valid model id.`)
    }
    return isValid;
}