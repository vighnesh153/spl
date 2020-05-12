import { Main } from "src/main";
import { Scope } from "src/models/Scope";

describe('check some sample programs.', () => {

    test('should print all multiples of 2 between 1 and 11.', () => {
        const code = `
let number i be 1
let array of number, arr, be []


loop while i <= 11:

    if i%2 == 0, then do:
        push i into arr

    set i to i + 1


display arr    
    
`;
        const main = new Main(code);
        main.compile(new Scope());

        expect(main.getOutput()).toStrictEqual('2,4,6,8,10\n');
    });

    test('should print fibonacci numbers less than 1000..', () => {
        const code = `


define function fibonacci with arguments [number n] which returns number:
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

display fibNums

`;
        const main = new Main(code);
        main.compile(new Scope());

        expect(main.getOutput()).toStrictEqual('0,1,1,2,3,5,8,13,21,34,55,89\n');
    });

});
