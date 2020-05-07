import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { numericComparisionEvaluator } from "src/expression-evaluators/boolean-expressions/numeric-comparision-evaluator";
import { bugReporter } from "src/language-bug-handling";

export class LessThanOrEqual extends ExpressionEvaluator {
    private identifier: string = '<=';

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
                (lhs, rhs) => lhs <= rhs
            );
        } else {
            bugReporter.report('INVALID_LESS_THAN_OR_EQUAL_COMPARISION');
        }
    }
}
