import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { bugReporter } from "src/language-bug-handling";
import { arithmeticOperationEvaluator } from "src/expression-evaluators/arithmetic-expressions/arithmetic-operation-evaluator";

export class AdditionEvaluator extends ExpressionEvaluator {
    private identifier: string = '+';

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        return text.includes(this.identifier);
    }

    evaluate(text: string): any {
        if (this.tryEvaluate(text)) {
            return arithmeticOperationEvaluator(
                text,
                this.identifier,
                this.scope,
                (lhs, rhs) => lhs + rhs
            );
        } else {
            bugReporter.report('INVALID_ADDITION_OPERATION');
        }
    }

}
