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

    test('should check for primality.', () => {
        const code = `


define function isPrime with arguments [ number n ] which returns boolean:
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


`;
        const main = new Main(code);
        main.compile(new Scope());

        expect(main.getOutput()).toStrictEqual('1: false\n' +
            '2: true\n' +
            '3: true\n' +
            '4: false\n' +
            '5: true\n' +
            '6: false\n' +
            '7: true\n' +
            '8: false\n' +
            '9: false\n' +
            '10: false\n' +
            '11: true\n' +
            '12: false\n' +
            '13: true\n' +
            '14: false\n' +
            '15: false\n' +
            '16: false\n' +
            '17: true\n' +
            '18: false\n' +
            '19: true\n' +
            '20: false\n' +
            '21: false\n' +
            '22: false\n' +
            '23: true\n' +
            '24: false\n' +
            '25: false\n' +
            '26: false\n' +
            '27: false\n' +
            '28: false\n' +
            '29: true\n' +
            '30: false\n' +
            '31: true\n' +
            '32: false\n' +
            '33: false\n' +
            '34: false\n' +
            '35: false\n' +
            '36: false\n' +
            '37: true\n' +
            '38: false\n' +
            '39: false\n' +
            '40: false\n' +
            '41: true\n' +
            '42: false\n' +
            '43: true\n' +
            '44: false\n' +
            '45: false\n' +
            '46: false\n' +
            '47: true\n' +
            '48: false\n' +
            '49: false\n' +
            '50: false\n');
    });

});
