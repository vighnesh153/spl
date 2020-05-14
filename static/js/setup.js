const consoleTab = CodeMirror.fromTextArea(
    document.getElementById('console'),
    {
        theme: 'material-palenight',
        indentUnit: 4,
        readOnly: "nocursor"
    }
);
consoleTab.setSize("100%", "100%");

CodeMirror.defineSimpleMode("simplemode", {
    start: [
        {regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string"},
        // {regex: /^\s*((break\s*)|(continue\s*)|(return( .*)?))$/, dedent: true},
        {regex: /(?:true|false)\b/, token: "keyword"},
        {regex: /(?:number|string|boolean|array)\b/, token: "variable-3"},
        { regex: new RegExp(`(?:${keywords.join('|')})\\b`), token: 'atom' },
        {regex: /[a-z$][\w$]*/, token: "variable"},
        {regex: /[-+\/*=<>!]+/, token: "operator"},
        {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number"},
        {regex: /(:\s*)$/, indent: true},
    ]
});


const editor = CodeMirror.fromTextArea(
    document.getElementById('code-area'),
    {
        lineNumbers: true,
        theme: 'material-ocean',
        indentUnit: 4,
        autofocus: true,
        indentWithTabs: true
    }
);
editor.setSize("100%", "100%");

