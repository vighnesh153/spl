import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { bugReporter } from "src/language-bug-handling";
import { BooleanExpressionEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-expression-evaluator";

export class ParenthesisEvaluator extends ExpressionEvaluator {

    constructor(public readonly scope: Scope) {
        super();
    }

    private static indexOfClosingParenthesis(text: string): number {
        let foundOpeningParenthesis = false;
        let countStartingUnmatched = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '(') {
                countStartingUnmatched++;
                foundOpeningParenthesis = true;
            } else if (text[i] === ')') {
                if (countStartingUnmatched === 0) {
                    // Parenthesis group is invalid
                    return -1;
                }
                countStartingUnmatched--;
            }

            if (countStartingUnmatched === 0 && foundOpeningParenthesis) {
                return i;
            }
        }

        return -1;
    }

    tryEvaluate(text: string): boolean {
        const indexOfOpeningParenthesis = text.indexOf('(');
        const indexOfClosingParenthesis =
            ParenthesisEvaluator.indexOfClosingParenthesis(text);

        return indexOfOpeningParenthesis >= 0 &&
            indexOfOpeningParenthesis < indexOfClosingParenthesis;
    }

    evaluate(text: string): any {
        if (this.tryEvaluate(text)) {
            const indexOfOpeningParenthesis = text.indexOf('(');
            const indexOfClosingParenthesis =
                ParenthesisEvaluator.indexOfClosingParenthesis(text);

            const insideExpression = text.substr(
                indexOfOpeningParenthesis + 1,
                indexOfClosingParenthesis - indexOfOpeningParenthesis - 1
            );

            const evaluators = new BooleanExpressionEvaluator(this.scope);
            for (const evaluator of evaluators.booleanExpressionEvaluators) {
                if (evaluator.tryEvaluate(insideExpression)) {
                    const result = evaluator.evaluate(insideExpression).toString();
                    return text.replace(`(${insideExpression})`, result);
                }
            }

            throw new Error('Invalid boolean expression');

        } else {
            bugReporter.report('EVALUATE_CALLED_ON_INVALID_PARENTHESIS_BLOCK');
        }
    }

}
