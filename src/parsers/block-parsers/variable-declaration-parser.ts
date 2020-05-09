import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { BlockParser } from "src/parsers/block-parsers/block-parser";

import { Block } from "src/blocks/Block";
import { VariableBlock, VariableBlockType } from "src/blocks/variable-blocks/variable-block";
import { ArrayVariableBlock } from "src/blocks/variable-blocks/array-variable-block";

import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { ArithmeticExpressionEvaluator } from "src/expression-evaluators/arithmetic-expressions/arithmetic-expression-evaluator";
import { BooleanExpressionEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-expression-evaluator";
import { StringExpressionEvaluator } from "src/expression-evaluators/string-expression-evaluator";
import { ArrayExpressionEvaluator } from "src/expression-evaluators/array-expression-evaluator";

export class VariableDeclarationParser extends BlockParser {
    private readonly expressionEvaluators: { [key: string]: ExpressionEvaluator } = {};

    private static primitiveRegex =
        /^let\s* (\S*)\s* (\S*)\s* be\s* (.*)\s*$/;
    private static arrayRegex =
        /^let\s* array\s* of\s* (\S*)\s*,\s*(\S*)\s*,\s*be\s* (.*)$/;

    constructor(public scope: Scope,
                public lineOfCodes: LineOfCode[]) {
        super();

        this.expressionEvaluators.number = new ArithmeticExpressionEvaluator(this.scope);
        this.expressionEvaluators.boolean = new BooleanExpressionEvaluator(this.scope);
        this.expressionEvaluators.string = new StringExpressionEvaluator(this.scope);
        this.expressionEvaluators.array = new ArrayExpressionEvaluator(this.scope);
    }

    private tryParsePrimitive(): boolean {
        const lineUnderTest = this.lineOfCodes[this.lineOfCodes.length - 1];
        return VariableDeclarationParser.primitiveRegex.test(lineUnderTest.value);
    }

    private tryParseArray(): boolean {
        const lineUnderTest = this.lineOfCodes[this.lineOfCodes.length - 1];
        return VariableDeclarationParser.arrayRegex.test(lineUnderTest.value);
    }

    tryParse(): boolean {
        const isPrimitiveDeclaration = this.tryParsePrimitive();
        const isArrayDeclaration = this.tryParseArray();
        return isPrimitiveDeclaration || isArrayDeclaration;
    }

    parsePrimitive(): Block {
        const lineUnderTest = this.lineOfCodes[this.lineOfCodes.length - 1];

        const result = lineUnderTest.value.match(VariableDeclarationParser.primitiveRegex);
        if (result) {
            const datatype = result[1];
            const variableName = result[2];
            const value = result[3];

            if (['number', 'string', 'boolean'].includes(datatype) === false) {
                if (datatype === 'array') {
                    throw new Error('Invalid datatype at line: ' + lineUnderTest.number +
                    '\nType of array needs to be provided as: array of <TYPE>');
                }
                throw new Error('Invalid datatype at line: ' + lineUnderTest.number);
            }

            const valueEvaluator = this.expressionEvaluators[datatype];

            if (valueEvaluator.tryEvaluate(value) === false) {
                throw new Error('Invalid value assigned to variable at line: ' + lineUnderTest.number);
            }

            // Remove the line as it is done parsing.
            this.lineOfCodes.pop();

            return new VariableBlock(
                VariableBlockType.declare,
                variableName,
                datatype,
                valueEvaluator.evaluate(value),
                false,
                this.scope
            );
        }
        throw new Error('Invalid statement. At line: ' + lineUnderTest.number);
    }

    parseArray(): Block {
        const lineUnderTest = this.lineOfCodes[this.lineOfCodes.length - 1];

        const result = lineUnderTest.value.match(VariableDeclarationParser.arrayRegex);
        if (result) {
            const arrayType = result[1];
            const variableName = result[2];
            const value = result[3];

            if (['number', 'string', 'boolean'].includes(arrayType) === false) {
                throw new Error('Invalid datatype at line: ' + lineUnderTest.number);
            }

            const valueEvaluator = this.expressionEvaluators.array as ArrayExpressionEvaluator;

            if (valueEvaluator.tryEvaluate(value) === false) {
                throw new Error('Invalid value assigned to variable at line: ' + lineUnderTest.number);
            }

            const valueType = valueEvaluator.getType(value);
            if (valueType !== arrayType && valueType !== 'any') {
                throw new Error('Datatype of variable doesn\'t match ' +
                    'with value assigned, at line: ' + lineUnderTest.number);
            }

            // Remove the line as it is done parsing.
            this.lineOfCodes.pop();

            return new ArrayVariableBlock(
                VariableBlockType.declare,
                variableName,
                'array',
                valueEvaluator.evaluate(value),
                false,
                this.scope,
                arrayType
            );
        }
        throw new Error('Invalid statement. At line: ' + lineUnderTest.number);
    }

    parse(): Block {
        if (this.tryParsePrimitive()) {
            return this.parsePrimitive();
        }
        if (this.tryParseArray()) {
            return this.parseArray();
        }
        throw new Error('Invalid variable declaration statement at line: ' +
            this.lineOfCodes[this.lineOfCodes.length - 1].number);
    }

}
