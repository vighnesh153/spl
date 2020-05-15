import "../lib/codemirror.css";
import "../lib/code-editor-theme.css";
import "../lib/console-theme.css";

import "../css/codemirror-overrides.css"
import "../css/menu-styles.css"
import "../css/modal.css"
import "../css/styles.css"

import "../js/modal";
import "../js/examples";
import { editor, consoleTab } from "./setup";

import { Main } from 'src/main';

const runButton = document.querySelector('.run-program');

let isProgramRunning = false;
runButton.addEventListener('click', () => {
    if (isProgramRunning) {
        return;
    }

    isProgramRunning = true;
    const code = editor.getValue();

    const main = new Main(code);
    main.compile();
    const processingTime = (new Date()).toLocaleString();
    consoleTab.setValue(`Processing, started at: ${processingTime}\n`);

    setTimeout(() => {
        const output = main.getOutput();
        const outputTime = (new Date()).toLocaleString();
        consoleTab.setValue(
            `Output at: ${outputTime}\n` +
            `********************\n` +
            `${output}`
        );

        isProgramRunning = false;
    }, 0);
});
