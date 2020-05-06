import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { NumberParser } from "src/parsers/data-type-parsers/primitive-parsers/number-parser";
import { bugReporter } from "src/language-bug-handling";

export class NumberEvaluator extends ExpressionEvaluator {
    private static numberParser = NumberParser.instance

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        const trimmed = text.trim();
        if (NumberEvaluator.numberParser.tryParse(trimmed)) {
            return true;
        }
        return this.scope.hasVariable(trimmed) &&
            this.scope.getVariable(trimmed).type === 'number';
    }

    evaluate(text: string): any {
        if (this.tryEvaluate(text)) {
            if (NumberEvaluator.numberParser.tryParse(text)) {
                return NumberEvaluator.numberParser.parse(text);
            }
            return this.scope.getVariable(text.trim()).value;
        } else {
            bugReporter.report('EVALUATING_INVALID_NUMBER');
        }
    }

}
