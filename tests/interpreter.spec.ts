import { Interpreter } from "src/interpreter";
import { LineOfCode } from "src/models/LineOfCode";
import { Scope } from "src/models/Scope";
import { OutputBuffer } from "src/models/OutputBuffer";

describe('check the functionality of variable and display parsers.', () => {

    let linesOfCode: LineOfCode[];
    let scope: Scope;
    let interpreter: Interpreter;
    beforeEach(() => {
        linesOfCode = [];
        scope = new Scope();
        interpreter = new Interpreter(linesOfCode, scope);
    });

    const addLineOfCode = (line: string) => {
        linesOfCode.push(new LineOfCode(line, Math.random()));
    }

    test('should set the variables.', () => {
        addLineOfCode("let number a be 123");
        addLineOfCode("let string b be 'vighnesh'");
        addLineOfCode("let boolean c be true");
        linesOfCode.reverse();

        interpreter = new Interpreter(linesOfCode, scope);
        interpreter.interpret();

        expect(scope.hasVariable('a')).toStrictEqual(true);
        expect(scope.hasVariable('b')).toStrictEqual(true);
        expect(scope.hasVariable('c')).toStrictEqual(true);

        expect(scope.getVariable('a').value).toStrictEqual(123);
        expect(scope.getVariable('b').value).toStrictEqual('vighnesh');
        expect(scope.getVariable('c').value).toStrictEqual(true);
    });

    test('should add to the output buffer.', () => {
        addLineOfCode("let number a be 123");
        addLineOfCode("let string b be 'vighnesh'");
        addLineOfCode("let boolean c be true");
        addLineOfCode("display a");
        addLineOfCode("display b");
        addLineOfCode("display c");
        linesOfCode.reverse();

        interpreter = new Interpreter(linesOfCode, scope);
        interpreter.interpret();

        const output = OutputBuffer.instance.getAndFlush();
        expect(output).toStrictEqual('123\nvighnesh\ntrue\n');
    });

    test('should modify the existing variable and output.', () => {
        addLineOfCode("let number a be 123");
        addLineOfCode("set a to 153");
        addLineOfCode("display a");
        linesOfCode.reverse();

        interpreter = new Interpreter(linesOfCode, scope);
        interpreter.interpret();

        const output = OutputBuffer.instance.getAndFlush();
        expect(output).toStrictEqual('153\n');
    });

    test('should loop over numbers and print just the even numbers.', () => {
        addLineOfCode("let number a be 0");
        addLineOfCode("loop while a < 10:");
        addLineOfCode("    if a%2 == 0, then do:");
        addLineOfCode("        display a");
        addLineOfCode("    set a to a + 1");
        linesOfCode.reverse();

        interpreter = new Interpreter(linesOfCode, scope);
        interpreter.interpret();

        const output = OutputBuffer.instance.getAndFlush();
        expect(output).toStrictEqual('0\n2\n4\n6\n8\n');
    });

    test('should loop over array and print just the multiples of 3.', () => {
        addLineOfCode("let array of number, arr, be " +
            "[1 ,2 , 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]");
        addLineOfCode("for every elem in arr:");
        addLineOfCode("    if elem%3 == 0, then do:");
        addLineOfCode("        display elem");
        linesOfCode.reverse();

        interpreter = new Interpreter(linesOfCode, scope);
        interpreter.interpret();

        const output = OutputBuffer.instance.getAndFlush();
        expect(output).toStrictEqual('3\n6\n9\n12\n');
    });
});
