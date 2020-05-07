import { reverseString } from "src/helpers/reverse-string";
import { Scope } from "src/models/Scope";
import { parseInitialBooleanOrIdentifier } from "src/helpers/parse-initial-boolean-or-identifier";
import { BooleanEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-evaluator";

export const booleanComparisionEvaluator = (text: string, identifier: string, scope: Scope, comparator
    : (a1: any, a2: any) => boolean) => {
    const individualComponents = text.split(identifier);
    const reversedLhs = reverseString(individualComponents[0]);
    const extractedIdentifierOrBoolean = parseInitialBooleanOrIdentifier(reversedLhs);

    const lhs = reverseString(extractedIdentifierOrBoolean);
    const rhs = parseInitialBooleanOrIdentifier(individualComponents[1]);

    const booleanEvaluator = new BooleanEvaluator(scope);

    if (booleanEvaluator.tryEvaluate(lhs) === false ||
        booleanEvaluator.tryEvaluate(rhs) === false) {
        throw new Error("Can't compare non-boolean symbols.");
    }

    const lhsBoolean = booleanEvaluator.evaluate(lhs);
    const rhsBoolean = booleanEvaluator.evaluate(rhs);

    const originalExpression = `${lhs}${identifier}${rhs}`;
    return text.replace(originalExpression, `${comparator(lhsBoolean, rhsBoolean)}`);
};
