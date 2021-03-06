import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { Scope } from "src/models/Scope";

export class LengthOfArrayEvaluator extends ExpressionEvaluator {
    private static regex = /^length\s* of (.*)$/;

    constructor(public scope: Scope) {
        super();
    }

    tryEvaluate(text: string): boolean {
        return LengthOfArrayEvaluator.regex.test(text.trim());
    }

    evaluate(text: string): any {
        text = text.trim();
        const result = text.match(LengthOfArrayEvaluator.regex);

        if (result) {
            const arrayName = result[1].trim();

            if (this.scope.hasVariable(arrayName) === false) {
                throw new Error(`'${arrayName}' is not a variable`);
            }

            const variable = this.scope.getVariable(arrayName);
            if (variable.type !== 'array') {
                throw new Error(`'${arrayName}' is not a array variable`);
            }

            return variable.value.length;
        }

        throw new Error('Invalid statement.');
    }

}
