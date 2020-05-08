import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { bugReporter } from "src/language-bug-handling";
import { StringParser } from "src/parsers/data-type-parsers/primitive-parsers/string-parser";

export class StringExpressionEvaluator extends ExpressionEvaluator {
    private static stringParser = StringParser.instance

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        const trimmed = text.trim();
        if (StringExpressionEvaluator.stringParser.tryParse(trimmed)) {
            return true;
        }
        return this.scope.hasVariable(trimmed) &&
            this.scope.getVariable(trimmed).type === 'string';
    }

    evaluate(text: string): any {
        if (this.tryEvaluate(text)) {
            if (StringExpressionEvaluator.stringParser.tryParse(text)) {
                return StringExpressionEvaluator.stringParser.parse(text);
            }
            return this.scope.getVariable(text.trim()).value;
        } else {
            bugReporter.report('EVALUATING_INVALID_STRING');
        }
    }
}
