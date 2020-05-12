import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { csvSplit } from "src/helpers/csv-split";

export class FunctionExpressionEvaluator extends ExpressionEvaluator {
    private static assignmentRegex = /^result\s* of (.*)\((.*)\)\s*$/;

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        return FunctionExpressionEvaluator.assignmentRegex.test(text.trim());
    }

    evaluate(text: string): any {
        text = text.trim();
        let funcName: string = "";
        let funcArgs: string = "";
        if (this.tryEvaluate(text)) {
            const result = text.match(FunctionExpressionEvaluator.assignmentRegex);
            if (result) {
                funcName = result[1].trim();
                funcArgs = result[2].trim();
            }
        }
        if (funcName === "") {
            throw 'Invalid statement.';
        }

        if (this.scope.hasFunction(funcName) === false) {
            throw new Error('Invalid function name.');
        }

        const func = this.scope.getFunction(funcName);
        func.argv = csvSplit(funcArgs);
        func.evaluationScope = this.scope;

        func.execute();

        return JSON.stringify(func.getResult().value).replace('"', "'");
    }

}