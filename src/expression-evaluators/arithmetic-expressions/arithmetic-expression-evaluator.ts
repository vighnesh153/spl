import { Scope } from "src/models/Scope";
import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";

import { bugReporter } from "src/language-bug-handling";

import { ParenthesisEvaluator } from "src/expression-evaluators/parenthesis-evaluator";
import { DivisionEvaluator } from "src/expression-evaluators/arithmetic-expressions/division-evaluator";
import { MultiplicationEvaluator } from "src/expression-evaluators/arithmetic-expressions/multiplication-evaluator";
import { ModuloEvaluator } from "src/expression-evaluators/arithmetic-expressions/modulo-evaluator";
import { AdditionEvaluator } from "src/expression-evaluators/arithmetic-expressions/addition-evaluator";
import { SubtractionEvaluator } from "src/expression-evaluators/arithmetic-expressions/subtraction-evaluator";
import { NumberEvaluator } from "src/expression-evaluators/arithmetic-expressions/number-evaluator";
import { NumberParser } from "src/parsers/data-type-parsers/primitive-parsers/number-parser";

export class ArithmeticExpressionEvaluator extends ExpressionEvaluator {
    readonly expressionEvaluators: ExpressionEvaluator[];

    constructor(public scope: Scope) {
        super();
        this.expressionEvaluators = [];

        // Following order matters
        this.expressionEvaluators.push(new ParenthesisEvaluator(this.scope, 'arithmetic'));

        this.expressionEvaluators.push(new DivisionEvaluator(this.scope));
        this.expressionEvaluators.push(new MultiplicationEvaluator(this.scope));
        this.expressionEvaluators.push(new ModuloEvaluator(this.scope));

        this.expressionEvaluators.push(new AdditionEvaluator(this.scope));
        this.expressionEvaluators.push(new SubtractionEvaluator(this.scope));

        this.expressionEvaluators.push(new NumberEvaluator(this.scope));
    }

    tryEvaluate(text: string): boolean {
        // Should not have string in expression. To identify, we check if
        // quotes are part of the expression. If yes, then there might
        // be a string.
        if (text.includes("'") || text.includes('"')) return false;

        for (const evaluator of this.expressionEvaluators) {
            if (evaluator.tryEvaluate(text)) {
                return true;
            }
        }
        return false;
    }

    evaluate(text: string): any {
        if (this.tryEvaluate(text)) {
            const numberParser = NumberParser.instance;

            while (numberParser.tryParse(text) === false) {
                let parsedByAny = false;
                for (const evaluator of this.expressionEvaluators) {
                    if (evaluator.tryEvaluate(text)) {
                        parsedByAny = true;
                        text = "" +  evaluator.evaluate(text);
                        break;
                    }
                }
                if (!parsedByAny) {
                    throw new Error('Invalid arithmetic expression');
                }
            }

            return numberParser.parse(text);
        } else {
            bugReporter.report('INVALID_ARITHMETIC_EXPRESSION_EVALUATION');
        }
    }

}
