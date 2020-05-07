import { Scope } from "src/models/Scope";
import { LogicalAnd } from "src/expression-evaluators/boolean-expressions/logical-and";
import { LogicalOr } from "src/expression-evaluators/boolean-expressions/logical-or";

describe('check the tryEvaluate functionality of logical-and.', () => {

    let scope: Scope;
    let logicalOr: LogicalOr;
    beforeEach(() => {
        scope = new Scope();
        logicalOr = new LogicalOr(scope)
    });

    test('should return false if input is empty.', () => {
        const input = "";
        const result = logicalOr.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return false if input is not a valid logical-or expression.', () => {
        const input = "1 >= 2";
        const result = logicalOr.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return true if input is a valid logical-or expression.', () => {
        const input = "1 < 2 or 2 > 1";
        const result = logicalOr.tryEvaluate(input);

        expect(result).toStrictEqual(true);
    });
});
