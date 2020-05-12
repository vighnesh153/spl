import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { csvSplit } from "src/helpers/csv-split";

export class FunctionExpressionEvaluator extends ExpressionEvaluator {
    private static assignmentRegex = /^result\s* of (.*)\((.*)\)$/;
    private static executionRegex = /^execute (.*)\((.*)\)$/;

    constructor(public scope: Scope) {
        super();
    }

    private static isAssignment(text: string): boolean {
        return FunctionExpressionEvaluator.assignmentRegex.test(text);
    }

    private static isExecution(text: string): boolean {
        return FunctionExpressionEvaluator.executionRegex.test(text);
    }

    tryEvaluate(text: string): boolean {
        const { isAssignment, isExecution } = FunctionExpressionEvaluator;
        return isAssignment(text.trim()) || isExecution(text.trim());
    }

    evaluate(text: string): any {
        text = text.trim();
        let funcName: string = "";
        let funcArgs: string = "";
        if (FunctionExpressionEvaluator.isAssignment(text)) {
            const result = text.match(FunctionExpressionEvaluator.assignmentRegex);
            if (result) {
                funcName = result[1].trim();
                funcArgs = result[2].trim();
            }
        }
        if (FunctionExpressionEvaluator.isExecution(text)) {
            const result = text.match(FunctionExpressionEvaluator.executionRegex);
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

        func.execute();

        return JSON.stringify(func.getResult().value).replace('"', "'");
    }

}
