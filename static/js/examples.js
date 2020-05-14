import { editor } from "./setup";
import { modalBg, body, modalButton, modal } from "./modal";

const examples = [
    { name: 'example 1', code:
`let number a be 123
let number b be 456
` },
    { name: 'example 2', code: 'Code 2' },
    { name: 'example 3', code: 'Code 3' },
    { name: 'example 4', code: 'Code 4' },
    { name: 'example 5', code: 'Code 5' },
    { name: 'example 6', code: 'Code 6' },
    { name: 'example 7', code: 'Code 7' },
    { name: 'example 8', code: 'Code 8' },
    { name: 'example 9', code: 'Code 9' },
    { name: 'example 10', code: 'Code 10' },
    { name: 'example 11', code: 'Code 11' },
    { name: 'example 12', code: 'Code 12' },
    { name: 'example 13', code: 'Code 13' },
    { name: 'example 14', code: 'Code 14' },
    { name: 'example 15', code: 'Code 15' },
    { name: 'example 16', code: 'Code 16' },
    { name: 'example 17', code: 'Code 17' },
    { name: 'example 18', code: 'Code 18' },
];

examples.forEach((example) => {
    const exampleElement = document.createElement('div');
    exampleElement.innerText = example.name;
    exampleElement.classList.add('example');
    exampleElement.addEventListener('click', () => {
        editor.setValue(example.code);
        modalBg.classList.remove('bg-active');
        body.style.overflow = 'auto';
    });
    document.querySelector('.examples-container').appendChild(exampleElement);
});
