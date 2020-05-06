import { Scope } from "src/models/Scope";
import { NotEquals } from "src/expression-evaluators/boolean-expressions/not-equals";

describe('check the tryEvaluate functionality of not equals.', () => {

    let scope: Scope;
    let notEquals: NotEquals;
    beforeEach(() => {
        scope = new Scope();
        notEquals = new NotEquals(scope)
    });

    test('should return false if input is empty.', () => {
        const input = "";
        const result = notEquals.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return false if input is not a valid not-equals expression.', () => {
        const input = "1 == 2";
        const result = notEquals.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return true if input is a valid not-equals expression.', () => {
        const input = "1 != 2";
        const result = notEquals.tryEvaluate(input);

        expect(result).toStrictEqual(true);
    });
});

describe('check the evaluate functionality of not equals.', () => {
    // Not required because we are just returning the negation of double equals
});
