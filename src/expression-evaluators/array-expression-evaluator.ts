import { Scope } from "src/models/Scope";
import { bugReporter } from "src/language-bug-handling";
import { ArrayParser } from "src/parsers/data-type-parsers/non-primitive-parsers/array-parser";

import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { ArithmeticExpressionEvaluator } from "src/expression-evaluators/arithmetic-expressions/arithmetic-expression-evaluator";
import { BooleanExpressionEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-expression-evaluator";
import { StringExpressionEvaluator } from "src/expression-evaluators/string-expression-evaluator";
import { csvSplit } from "src/helpers/csv-split";

export class ArrayExpressionEvaluator extends ExpressionEvaluator {
    private static arrayParser = ArrayParser.instance
    private readonly expressionEvaluators: ExpressionEvaluator[] = [];

    private types: { [key: number]: string } = {
        0: 'number',
        1: 'boolean',
        2: 'string',
    };

    constructor(public scope: Scope) {
        super();

        // Order important. If want to change order,
        // change the this.types property as well.
        this.expressionEvaluators.push(new ArithmeticExpressionEvaluator(this.scope));
        this.expressionEvaluators.push(new BooleanExpressionEvaluator(this.scope));
        this.expressionEvaluators.push(new StringExpressionEvaluator(this.scope));
    }

    getType(text: string): string {
        if (this.tryEvaluate(text) === false) {
            throw new Error('Invalid array type.');
        }
        const array = this.evaluate(text);
        if (array.length === 0) {
            return 'any';
        }
        if (array[0].toString() === array[0]) {
            return 'string';
        }
        if (JSON.parse(array[0]) === true || JSON.parse(array[0]) === false) {
            return 'boolean';
        }
        return 'number';
    }

    private tryParseExpressionBasedArray(text: string): boolean {
        const trimmed = text.trim();

        if (trimmed.startsWith('[') === false ||
            trimmed.endsWith(']') === false) {
            return false;
        }

        // Remove the start and end brackets
        const innerContent = trimmed.slice(1, trimmed.length - 1).trim();

        const arrayElements = csvSplit(innerContent);

        let type: string = 'any';
        let isArrayValid = true;
        arrayElements.forEach(element => {
            if (isArrayValid === false) return;
            let parsedByAny = false;

            this.expressionEvaluators.forEach((evaluator, index) => {
                if (isArrayValid === false) return;

                if (evaluator.tryEvaluate(element) && parsedByAny === false) {
                    if (type === 'any') {
                        type = this.types[index];
                    } else if (type !== this.types[index]) {
                        isArrayValid = false;
                    }
                    parsedByAny = true;
                }
            });

            if (parsedByAny === false) isArrayValid = false;
        });

        return isArrayValid;
    }

    private parseExpressionBasedArray(text: string): any {
        const trimmed = text.trim();

        // Remove the start and end brackets
        const innerContent = trimmed.slice(1, trimmed.length - 1).trim();
        const arrayElements = csvSplit(innerContent);

        const result: any[] = [];

        for (const element of arrayElements) {
            for (const evaluator of this.expressionEvaluators) {
                if (evaluator.tryEvaluate(element)) {
                    result.push(evaluator.evaluate(element));
                }
            }
        }

        return result;
    }

    tryEvaluate(text: string): boolean {
        const trimmed = text.trim();
        if (ArrayExpressionEvaluator.arrayParser.tryParse(trimmed)) {
            return true;
        }
        if (this.tryParseExpressionBasedArray(trimmed)) {
            return true;
        }
        return this.scope.hasVariable(trimmed) &&
            this.scope.getVariable(trimmed).type === 'array';
    }

    evaluate(text: string): any {
        if (this.tryEvaluate(text)) {
            if (ArrayExpressionEvaluator.arrayParser.tryParse(text)) {
                return ArrayExpressionEvaluator.arrayParser.parse(text);
            }
            if (this.tryParseExpressionBasedArray(text)) {
                return this.parseExpressionBasedArray(text);
            }
            return this.scope.getVariable(text.trim()).value;
        } else {
            bugReporter.report('EVALUATING_INVALID_STRING');
        }
    }
}
