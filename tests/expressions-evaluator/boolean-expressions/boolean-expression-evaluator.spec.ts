import { BooleanExpressionEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-expression-evaluator";
import { Scope } from "src/models/Scope";
import { VariableBlock, VariableBlockType } from "src/blocks/variable-block";

describe('check the tryEvaluate functionality of boolean-expression-evaluator.', () => {

    let scope: Scope;
    let booleanExpressionEvaluator: BooleanExpressionEvaluator;
    beforeEach(() => {
        scope = new Scope();
        booleanExpressionEvaluator = new BooleanExpressionEvaluator(scope);
    });

    test('should return false for empty input.', () => {
        const input = "";
        const result = booleanExpressionEvaluator.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return true for a boolean value input.', () => {
        const input = " true   ";
        const result = booleanExpressionEvaluator.tryEvaluate(input);

        expect(result).toStrictEqual(true);
    });

    test('should return false for a numeric value input.', () => {
        const input = " 123   ";
        const result = booleanExpressionEvaluator.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return true for a string value input.', () => {
        const input = " 'Hello World'   ";
        const result = booleanExpressionEvaluator.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return true for a boolean variable input.', () => {
        const input = " someVariable  ";

        const variableBlock = new VariableBlock(
            VariableBlockType.declare,
            'someVariable',
            'boolean',
            true,
            true,
            scope
        );
        variableBlock.execute();

        const result = booleanExpressionEvaluator.tryEvaluate(input);
        expect(result).toStrictEqual(true);
    });

    test('should return false for a numeric variable input.', () => {
        const input = " someVariable  ";

        const variableBlock = new VariableBlock(
            VariableBlockType.declare,
            'someVariable',
            'number',
            3424,
            true,
            scope
        );
        variableBlock.execute();

        const result = booleanExpressionEvaluator.tryEvaluate(input);
        expect(result).toStrictEqual(false);
    });

    test('should return false for a string variable input.', () => {
        const input = " someVariable  ";

        const variableBlock = new VariableBlock(
            VariableBlockType.declare,
            'someVariable',
            'string',
            'Some string',
            true,
            scope
        );
        variableBlock.execute();

        const result = booleanExpressionEvaluator.tryEvaluate(input);
        expect(result).toStrictEqual(false);
    });

    test.each([
        ['1 < 2', true],
        ['true and 1 < 2', true],
        ['false or false', true],
        ['1 <= 10', true],
        ['2 >= 90', true],
        [" 'hello' ", false],
        [' 100', false]
    ])('some basic asserts', (input: string, expected: boolean) => {
        const result = booleanExpressionEvaluator.tryEvaluate(input);
        expect(result).toStrictEqual(expected);
    });
});

describe('check the evaluate functionality of boolean-expression-evaluator.', () => {

    let scope: Scope;
    let booleanExpressionEvaluator: BooleanExpressionEvaluator;
    beforeEach(() => {
        scope = new Scope();
        booleanExpressionEvaluator = new BooleanExpressionEvaluator(scope);
    });

    test.each([
        ['1 < 2', true],
        ['true and 1 < 2', true],
        ['false or false', false],
        ['1 <= 10', true],
        ['2 >= 90', false],
        [' false or 100 < 90', false]
    ])('should evaluate simple boolean expressions',
        (input: string, expected: boolean) => {
        const result = booleanExpressionEvaluator.evaluate(input);
        expect(result).toStrictEqual(expected);
    });
});
