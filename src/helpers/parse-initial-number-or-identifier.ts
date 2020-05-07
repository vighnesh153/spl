const isValid = (text: string, reversed: boolean) => {
    if (reversed) {
        return /^\s*[_.a-zA-Z0-9]*-?$/.test(text);
    } else {
        return /^\s*-?[_.a-zA-Z0-9]*$/.test(text);
    }
}

export const parseInitialNumberOrIdentifier = (text: string, reversed: boolean): string => {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const subString = text.substr(0, i + 1);
        if (isValid(subString, reversed)) {
            result = subString;
        } else {
            break;
        }
    }
    return result;
};
