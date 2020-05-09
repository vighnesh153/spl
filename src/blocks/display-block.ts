import { Block } from "src/blocks/Block";
import { Scope } from "src/models/Scope";

import { OutputBuffer } from "src/models/OutputBuffer";

import { DatatypeParser } from "src/parsers/data-type-parsers/datatype-parser";
import { BooleanParser } from "src/parsers/data-type-parsers/primitive-parsers/boolean-parser";
import { NumberParser } from "src/parsers/data-type-parsers/primitive-parsers/number-parser";
import { StringParser } from "src/parsers/data-type-parsers/primitive-parsers/string-parser";
import { ArrayParser } from "src/parsers/data-type-parsers/non-primitive-parsers/array-parser";
import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { ArrayExpressionEvaluator } from "src/expression-evaluators/array-expression-evaluator";
import { ArithmeticExpressionEvaluator } from "src/expression-evaluators/arithmetic-expressions/arithmetic-expression-evaluator";
import { StringExpressionEvaluator } from "src/expression-evaluators/string-expression-evaluator";
import { BooleanExpressionEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-expression-evaluator";

export class DisplayBlock extends Block {
    scope: Scope;

    private readonly expressionEvaluators: ExpressionEvaluator[] = [];

    constructor(private values: string[], parentScope: Scope) {
        super();
        this.scope = parentScope;

        this.expressionEvaluators.push(new ArrayExpressionEvaluator(this.scope));
        this.expressionEvaluators.push(new BooleanExpressionEvaluator(this.scope));
        this.expressionEvaluators.push(new ArithmeticExpressionEvaluator(this.scope));
        this.expressionEvaluators.push(new StringExpressionEvaluator(this.scope));
    }

    execute(): void {
        const outputBuffer = OutputBuffer.instance;

        for (const value of this.values) {
            let isLiteral = false;
            for (const evaluator of this.expressionEvaluators) {
                if (evaluator.tryEvaluate(value)) {
                    isLiteral = true;
                    const stringForm = evaluator.evaluate(value).toString();
                    outputBuffer.push(stringForm);
                    break;
                }
            }
            if (isLiteral === false) {
                if (this.scope.hasVariable(value)) {
                    const variable = this.scope.getVariable(value);
                    outputBuffer.push(variable.value.toString());
                } else {
                    throw new Error("Cannot resolve symbol: " + value);
                }
            }
        }

        outputBuffer.push('\n');
    }

}
