import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { bugReporter } from "src/language-bug-handling";
import { StringParser } from "src/parsers/data-type-parsers/primitive-parsers/string-parser";
import { ArrayIndexEvaluator } from "src/expression-evaluators/array-index-evaluator";

export class StringExpressionEvaluator extends ExpressionEvaluator {
    private static stringParser = StringParser.instance
    private arrayIndexEvaluator: ArrayIndexEvaluator;

    constructor(public scope: Scope) {
        super();
        this.arrayIndexEvaluator = new ArrayIndexEvaluator(scope, 'string');
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
        const trimmed = text.trim();
        if (this.tryEvaluate(trimmed)) {
            if (StringExpressionEvaluator.stringParser.tryParse(trimmed)) {
                return StringExpressionEvaluator.stringParser.parse(trimmed);
            }
            return this.scope.getVariable(trimmed).value;
        } else {
            bugReporter.report('EVALUATING_INVALID_STRING');
        }
    }
}
