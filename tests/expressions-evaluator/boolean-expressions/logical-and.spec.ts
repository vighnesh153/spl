import { Scope } from "src/models/Scope";
import { LogicalAnd } from "src/expression-evaluators/boolean-expressions/logical-and";

describe('check the tryEvaluate functionality of logical-and.', () => {

    let scope: Scope;
    let logicalAnd: LogicalAnd;
    beforeEach(() => {
        scope = new Scope();
        logicalAnd = new LogicalAnd(scope)
    });

    test('should return false if input is empty.', () => {
        const input = "";
        const result = logicalAnd.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return false if input is not a valid logical-and expression.', () => {
        const input = "1 >= 2";
        const result = logicalAnd.tryEvaluate(input);

        expect(result).toStrictEqual(false);
    });

    test('should return true if input is a valid logical-and expression.', () => {
        const input = "1 < 2 and 2 > 1";
        const result = logicalAnd.tryEvaluate(input);

        expect(result).toStrictEqual(true);
    });
});
