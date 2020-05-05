export const bugReport = (code: string): void => {
    throw new Error(`LANGUAGE BUG: ${code}. ` +
        "Please do report this to me along with your source code.");
}
