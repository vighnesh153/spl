import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { GreaterThan } from "src/expression-evaluators/boolean-expressions/greater-than";

export class LessThanOrEqual extends ExpressionEvaluator {
    private identifier: string = '<=';

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        return text.includes(this.identifier);
    }

    evaluate(text: string): any {
        const greaterThan = new GreaterThan(this.scope);

        return greaterThan.evaluate(text) === false;
    }
}
