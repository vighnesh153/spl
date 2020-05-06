import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { NumberEvaluator } from "src/expression-evaluators/arithmetic-expressions/number-evaluator";
import { bugReporter } from "src/language-bug-handling";

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
            const individualComponents = text.split(this.identifier);
            const lhs = individualComponents[0];
            const rhs = individualComponents[1];

            const numberEvaluator = new NumberEvaluator(this.scope);

            if (numberEvaluator.tryEvaluate(lhs) === false ||
                numberEvaluator.tryEvaluate(rhs) === false) {
                throw new Error("Can't compare non-number symbols.");
            }

            const lhsNumber = numberEvaluator.evaluate(lhs);
            const rhsNumber = numberEvaluator.evaluate(rhs);

            return lhsNumber > rhsNumber;
        } else {
            bugReporter.report('INVALID_GREATER_THAN_COMPARISION');
        }
    }

}
