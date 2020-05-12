import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { bugReporter } from "src/language-bug-handling";
import { BooleanParser } from "src/parsers/data-type-parsers/primitive-parsers/boolean-parser";
import { ArrayIndexEvaluator } from "src/expression-evaluators/array-index-evaluator";

export class BooleanEvaluator extends ExpressionEvaluator {
    private static booleanParser = BooleanParser.instance
    private arrayIndexEvaluator: ArrayIndexEvaluator;

    constructor(public scope: Scope) {
        super();
        this.arrayIndexEvaluator = new ArrayIndexEvaluator(scope, 'boolean');
    }

    tryEvaluate(text: string): boolean {
        const trimmed = text.trim();
        if (BooleanEvaluator.booleanParser.tryParse(trimmed)) {
            return true;
        }
        if (this.scope.hasVariable(trimmed) &&
            this.scope.getVariable(trimmed).type === 'boolean') {
            return true
        }
        return this.arrayIndexEvaluator.tryEvaluate(text.trim());
    }

    evaluate(text: string): any {
        const trimmed = text.trim();
        if (this.tryEvaluate(trimmed)) {
            if (BooleanEvaluator.booleanParser.tryParse(trimmed)) {
                return BooleanEvaluator.booleanParser.parse(trimmed);
            }
            if (this.scope.hasVariable(trimmed)) {
                return this.scope.getVariable(trimmed).value;
            }
            return this.arrayIndexEvaluator.evaluate(trimmed);
        } else {
            bugReporter.report('EVALUATING_INVALID_BOOLEAN');
        }
    }

}
