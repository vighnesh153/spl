import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { BooleanExpressionEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-expression-evaluator";

export class LogicalOr extends ExpressionEvaluator {
    identifier = 'or';

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        return text.includes(this.identifier);
    }

    evaluate(text: string): any {
        const splitEnds = text.trim().split(this.identifier);
        const lhs = splitEnds[0].trim();
        const rhs = splitEnds[1].trim();

        const booleanExpressionEvaluator = new BooleanExpressionEvaluator(this.scope);

        if (booleanExpressionEvaluator.tryEvaluate(lhs) === false ||
            booleanExpressionEvaluator.tryEvaluate(rhs) === false) {
            throw new Error('Invalid boolean expressions.');
        }

        const lhsResult = booleanExpressionEvaluator.evaluate(lhs);
        const rhsResult = booleanExpressionEvaluator.evaluate(rhs);

        return lhsResult || rhsResult;
    }
}
