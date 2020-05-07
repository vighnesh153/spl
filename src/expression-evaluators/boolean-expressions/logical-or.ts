import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { booleanComparisionEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-comparision-evaluator";
import { bugReporter } from "src/language-bug-handling";

export class LogicalOr extends ExpressionEvaluator {
    identifier = 'or';

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        return text.includes(this.identifier);
    }

    evaluate(text: string): any {
        if (this.tryEvaluate(text)) {
            return booleanComparisionEvaluator(
                text,
                this.identifier,
                this.scope,
                (lhs, rhs) => lhs || rhs
            );
        } else {
            bugReporter.report('INVALID_LOGICAL_OR_COMPARISION');
        }
    }
}
