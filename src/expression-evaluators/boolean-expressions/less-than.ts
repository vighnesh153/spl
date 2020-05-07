import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { GreaterThanOrEqual } from "src/expression-evaluators/boolean-expressions/greater-than-or-equal";

export class LessThan extends ExpressionEvaluator {
    private identifier: string = '<';

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        return text.includes(this.identifier);
    }

    evaluate(text: string): any {
        const greaterThanOrEqual = new GreaterThanOrEqual(this.scope);

        return greaterThanOrEqual.evaluate(
            text.replace(this.identifier, ">=")
        ) === false;
    }
}
