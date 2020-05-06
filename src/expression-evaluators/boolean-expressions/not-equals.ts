import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { DoubleEquals } from "src/expression-evaluators/boolean-expressions/double-equals";

export class NotEquals extends ExpressionEvaluator {
    private identifier: string = '!=';

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        return text.includes(this.identifier);
    }

    evaluate(text: string): any {
        return (new DoubleEquals(this.scope)).evaluate(text) === false;
    }

}
