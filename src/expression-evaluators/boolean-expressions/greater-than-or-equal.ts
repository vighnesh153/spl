import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { GreaterThan } from "src/expression-evaluators/boolean-expressions/greater-than";
import { DoubleEquals } from "src/expression-evaluators/boolean-expressions/double-equals";
import { numericComparisionEvaluator } from "src/expression-evaluators/boolean-expressions/numeric-comparision-evaluator";
import { bugReporter } from "src/language-bug-handling";

export class GreaterThanOrEqual extends ExpressionEvaluator {
    private identifier: string = '>=';

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
                (lhs, rhs) => lhs >= rhs
            );
        } else {
            bugReporter.report('INVALID_GREATER_THAN_OR_EQUAL_COMPARISION');
        }
    }
}
