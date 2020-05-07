import { Scope } from "src/models/Scope";
import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";

import { BooleanEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-evaluator";
import { LogicalAnd } from "src/expression-evaluators/boolean-expressions/logical-and";
import { LogicalOr } from "src/expression-evaluators/boolean-expressions/logical-or";
import { DoubleEquals } from "src/expression-evaluators/boolean-expressions/double-equals";
import { NotEquals } from "src/expression-evaluators/boolean-expressions/not-equals";
import { GreaterThan } from "src/expression-evaluators/boolean-expressions/greater-than";
import { GreaterThanOrEqual } from "src/expression-evaluators/boolean-expressions/greater-than-or-equal";
import { LessThan } from "src/expression-evaluators/boolean-expressions/less-than";
import { LessThanOrEqual } from "src/expression-evaluators/boolean-expressions/less-than-or-equal";
import { bugReporter } from "src/language-bug-handling";

export class BooleanExpressionEvaluator extends ExpressionEvaluator {
    private readonly booleanExpressionEvaluators: ExpressionEvaluator[];

    constructor(public scope: Scope) {
        super();

        // Following order matters
        this.booleanExpressionEvaluators = [
            new BooleanEvaluator(this.scope),
            new LogicalAnd(this.scope),
            new LogicalOr(this.scope),
            new DoubleEquals(this.scope),
            new NotEquals(this.scope),
            new GreaterThanOrEqual(this.scope),
            new GreaterThan(this.scope),
            new LessThanOrEqual(this.scope),
            new LessThan(this.scope)
        ];
    }

    tryEvaluate(text: string): boolean {
        // Should not have string in expression. To identify, we check if
        // quotes are part of the expression. If yes, then there might
        // be a string.
        if (text.includes("'")) return false;

        for (const evaluator of this.booleanExpressionEvaluators) {
            if (evaluator.tryEvaluate(text)) {
                return true;
            }
        }
        return false;
    }

    evaluate(text: string): any {
        if (this.tryEvaluate(text)) {
            for (const evaluator of this.booleanExpressionEvaluators) {
                if (evaluator.tryEvaluate(text)) {
                    return evaluator.evaluate(text);
                }
            }
            bugReporter.report('BOOLEAN_EXPRESSION_EVALUATION_SHOULD_NOT_HAVE_FAILED');
        } else {
            bugReporter.report('INVALID_BOOLEAN_EXPRESSION_EVALUATION');
        }
    }

}
