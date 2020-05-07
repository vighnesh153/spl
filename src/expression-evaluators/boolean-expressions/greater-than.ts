import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { bugReporter } from "src/language-bug-handling";
import { numericComparisionEvaluator } from "src/expression-evaluators/boolean-expressions/numeric-comparision-evaluator";

export class GreaterThan extends ExpressionEvaluator {
    private identifier: string = '>';

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        return text.includes(this.identifier);
    }

    evaluate(text: string): any {
        if (this.tryEvaluate(text)) {
            return numericComparisionEvaluator(
                text,
                this.identifier,
                this.scope,
                (lhs, rhs) => lhs > rhs
            );
        } else {
            bugReporter.report('INVALID_GREATER_THAN_COMPARISION');
        }
    }

}
