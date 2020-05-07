import { Scope } from "src/models/Scope";
import { GreaterThanOrEqual } from "src/expression-evaluators/boolean-expressions/greater-than-or-equal";

describe('check the tryEvaluate functionality of greater-than-or-equal.', () => {

    let scope: Scope;
    let greaterThanOrEqual: GreaterThanOrEqual;
    beforeEach(() => {
        scope = new Scope();
        greaterThanOrEqual = new GreaterThanOrEqual(scope)
    });

    test('should return false if input is empty.', () => {
        const input = "";
        const result = greaterThanOrEqual.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return false if input is not a valid greater-than or equal expression.', () => {
        const input = "1 == 2";
        const result = greaterThanOrEqual.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return true if input is a valid greater-than-or-equal expression.', () => {
        const input = "1 >= 2";
        const result = greaterThanOrEqual.tryEvaluate(input);

        expect(result).toStrictEqual(true);
    });
});

describe('check the evaluate functionality of greater-than or equal.', () => {
    // Not requires as we are using other comparators to build this.
});
