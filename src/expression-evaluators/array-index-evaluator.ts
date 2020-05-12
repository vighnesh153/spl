import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";
import { ArithmeticExpressionEvaluator } from "src/expression-evaluators/arithmetic-expressions/arithmetic-expression-evaluator";

export class ArrayIndexEvaluator extends ExpressionEvaluator {

    private static regex = /^(.+)\[(.*)]$/;

    constructor(public scope: Scope, public arrayType: string) {
        super();
    }

    getType(text: string): string {
        const result = text.match(ArrayIndexEvaluator.regex);

        if (result) {
            const arrayName = result[1].trim();

            if (this.scope.hasVariable(arrayName) === false) {
                throw new Error(`Undefined symbol: ${arrayName}`);
            }

            if (this.scope.getVariable(arrayName).type !== 'array') {
                throw new Error(`${arrayName} is not an array.`);
            }

            return this.scope.getVariable(arrayName).arrayType as string;
        }
        throw new Error('Invalid statement.');
    }

    tryEvaluate(text: string): boolean {
        return this.getType(text.trim()) === this.arrayType;
    }

    evaluate(text: string): any {
        const result = text.trim().match(ArrayIndexEvaluator.regex);

        if (result) {
            const arrayName = result[1].trim();
            const indexString = result[2];

            const evaluator = new ArithmeticExpressionEvaluator(this.scope);
            if (evaluator.tryEvaluate(indexString) === false) {
                throw new Error('Invalid index.');
            }

            const index = evaluator.evaluate(indexString);
            const variable = this.scope.getVariable(arrayName);

            if (index < 0 || index >= variable.value.length) {
                throw new Error('Index out of bounds.');
            }
            return variable.value[index];
        }
        throw new Error('Invalid statement.');
    }

}
