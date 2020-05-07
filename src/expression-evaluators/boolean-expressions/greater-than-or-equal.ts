import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { GreaterThan } from "src/expression-evaluators/boolean-expressions/greater-than";
import { DoubleEquals } from "src/expression-evaluators/boolean-expressions/double-equals";

export class GreaterThanOrEqual extends ExpressionEvaluator {
    private identifier: string = '>=';

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        return text.includes(this.identifier);
    }

    evaluate(text: string): any {
        const greaterThan = new GreaterThan(this.scope);
        const doubleEquals = new DoubleEquals(this.scope);

        return greaterThan.evaluate(text.replace(this.identifier, ">")) ||
            doubleEquals.evaluate(text.replace(this.identifier, "=="));
    }
}
