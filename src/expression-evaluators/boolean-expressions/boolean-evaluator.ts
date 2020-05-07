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
            this.scope.getVariable(trimmed).type === 'boolean';
    }

    evaluate(text: string): any {
        if (this.tryEvaluate(text)) {
            if (BooleanEvaluator.booleanParser.tryParse(text)) {
                return BooleanEvaluator.booleanParser.parse(text);
            }
            return this.scope.getVariable(text.trim()).value;
        } else {
            bugReporter.report('EVALUATING_INVALID_BOOLEAN');
        }
    }

}
