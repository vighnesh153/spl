import { BlockParser } from "src/parsers/block-parsers/block-parser";
import { VariableDeclarationParser } from "src/parsers/block-parsers/variable-declaration-parser";
import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { VariableBlock } from "src/blocks/variable-blocks/variable-block";

describe('should parse the matching declaration statement.', () => {

    let blockParser: BlockParser;
    let scope: Scope;
    let linesOfCode: LineOfCode[];
    beforeEach(() => {
        scope = new Scope();
        linesOfCode = [
            new LineOfCode('', Math.random()),
        ]
        blockParser = new VariableDeclarationParser(scope, linesOfCode);
    });

    test('should return false if empty statement is passed.', () => {
        linesOfCode[0].value = ''

        const result = blockParser.tryParse();
        expect(result).toStrictEqual(false);
    });

    test.each([
        '   let number a be 1', // Indentation
        'let array of   A be [1 ,2 ,3]', // Type of array not specified
    ])('should return false if incorrect statement is passed.', (input: string) => {
        linesOfCode[0].value = input

        const result = blockParser.tryParse();
        expect(result).toStrictEqual(false);
    });

    test('should return true if correct statement is passed.', () => {
        linesOfCode[0].value = 'let number a be 111'

        expect(blockParser.tryParse()).toStrictEqual(true);
    });
});

describe('should return correct block.', () => {

    let blockParser: BlockParser;
    let scope: Scope;
    let linesOfCode: LineOfCode[];
    beforeEach(() => {
        scope = new Scope();
        linesOfCode = [
            new LineOfCode('', Math.random()),
        ]
        blockParser = new VariableDeclarationParser(scope, linesOfCode);
    });

    test('should return correct primitive block.', () => {
        linesOfCode[0].value = "let string s be 'Hello World!'";

        const block = blockParser.parse() as VariableBlock;
        expect(block.value).toStrictEqual('Hello World!');
        expect(block.variableName).toStrictEqual('s');
        expect(block.typeOfVariable).toStrictEqual('string');
    });
});
