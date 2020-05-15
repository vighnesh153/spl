import { editor } from "./setup";
import { modalBg, body, modalButton, modal } from "./modal";

const examples = [
    { name: 'Is Prime?', code:
`define function isPrime with arguments [ number n ] which returns boolean:
\tif n <= 3, then do:
\t\treturn n > 1
\t
\tif n%2 == 0 or n%3 == 0, then do:
\t\treturn false
\t
\tlet number i be 5
\tloop while i*i <= n:
\t\tlet number nModI be n % i
\t\tlet number nModIPlus2 be n % (i + 2)
\t\tif nModI == 0 or nModIPlus2 == 0, then do:
\t\t\treturn false
\t\t
\t\tset i to i + 6
\t
\treturn true

let number num be 1
loop while num <= 50:
\tlet boolean answer be result of isPrime(num)
\tdisplay num, ': ', answer
\tset num to num + 1
` },
    { name: 'Factorial', code:
`define function factorial with arguments [ number n ] which returns number:
\tif n == 0 or n == 1, then do:
\t\treturn n
\t
\tlet number factNMinus1 be result of factorial(n - 1)
\treturn n * factNMinus1

\t\t
let number num be 1
loop while num <=10:
\tlet number res be result of factorial(num)
\tdisplay num, ' factorial is ', res
\tset num to num + 1
`
    },
    { name: 'Fibonacci number', code:
`define function fibonacci with arguments [number n] which returns number:
    if n == 0, then do:
        return 0
    
    if n == 1, then do:
        return 1
    
    let number fibN_take_1 be result of fibonacci(n - 1)
    let number fibN_take_2 be result of fibonacci(n - 2)
    
    return fibN_take_1 + fibN_take_2


let array of number, fibNums, be []
let number i be 0
loop while true:
    let number ithFibNum be result of fibonacci(i)
    if ithFibNum > 100, then do:
        break
    push ithFibNum into fibNums
    set i to i + 1

display 'Fibonacci numbers less than 100 are '
for every fibNum in fibNums:
\tdisplay fibNum
`
    },
    { name: 'Sort', code: `
define function bubbleSort with arguments [ array of number arr ] which returns array of number:
\tlet number i be 0
\tlet number arrLen be length of arr
\tloop while i < arrLen:
\t\tlet number j be 0
\t\tloop while j+1 < arrLen:
\t\t\tif arr[j+1] < arr[j], then do:
\t\t\t\tlet number temp be arr[j]
\t\t\t\tset arr[j] to arr[j+1]
\t\t\t\tset arr[j+1] to temp
\t\t\tset j to j + 1
\t\tset i to i + 1
\treturn arr

let array of number, myNumberArray, be [ 34, 42, 12, 45, 64, 22, 21, 43, 2, 23, 1, 0]
let array of number, sortedArray, be result of bubbleSort(myNumberArray)
display sortedArray
    ` },
    { name: 'Nested Loops', code: `
loop for 5 times with i as counter:
\tloop for 6 times with j as counter:
\t\tloop for 7 times with k as counter:
\t\t\tdisplay i, ', ', j, ', ', k
    ` },
    { name: 'FizzBuzz', code: `
define function fizzBuzz with arguments [ number n ] which returns nothing:
\tloop for n times with i as counter:
\t\tif i%15 == 0, then do:
\t\t\tdisplay 'FizzBuzz'
\t\telse if i%3 == 0, then do:
\t\t\tdisplay 'Fizz'
\t\telse if i%5 == 0, then do:
\t\t\tdisplay 'Buzz'
\t\telse, do:
\t\t\tdisplay i

\t\t\t
execute fizzBuzz(20)

    ` }
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
