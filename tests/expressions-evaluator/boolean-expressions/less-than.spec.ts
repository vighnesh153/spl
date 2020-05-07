import { Scope } from "src/models/Scope";
import { LessThan } from "src/expression-evaluators/boolean-expressions/less-than";

describe('check the tryEvaluate functionality of less-than.', () => {

    let scope: Scope;
    let lessThan: LessThan;
    beforeEach(() => {
        scope = new Scope();
        lessThan = new LessThan(scope)
    });

    test('should return false if input is empty.', () => {
        const input = "";
        const result = lessThan.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return false if input is not a valid less-than or equal expression.', () => {
        const input = "1 != 2";
        const result = lessThan.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return true if input is a valid less-than expression.', () => {
        const input = "1 < 2";
        const result = lessThan.tryEvaluate(input);

        expect(result).toStrictEqual(true);
    });
});

describe('check the evaluate functionality of less-than or equal.', () => {
    // Not requires as we are using other comparators to build this.
});
