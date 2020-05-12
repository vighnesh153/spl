import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { bugReporter } from "src/language-bug-handling";
import { BooleanParser } from "src/parsers/data-type-parsers/primitive-parsers/boolean-parser";

export class BooleanEvaluator extends ExpressionEvaluator {
    private static booleanParser = BooleanParser.instance

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        const trimmed = text.trim();
        if (BooleanEvaluator.booleanParser.tryParse(trimmed)) {
            return true;
        }
        return this.scope.hasVariable(trimmed) &&
            this.scope.getVariable(trimmed).type === 'boolean'
    }

    evaluate(text: string): any {
        const trimmed = text.trim();
        if (this.tryEvaluate(trimmed)) {
            if (BooleanEvaluator.booleanParser.tryParse(trimmed)) {
                return BooleanEvaluator.booleanParser.parse(trimmed);
            }
            return this.scope.getVariable(trimmed).value;
        } else {
            bugReporter.report('EVALUATING_INVALID_BOOLEAN');
        }
    }

}
