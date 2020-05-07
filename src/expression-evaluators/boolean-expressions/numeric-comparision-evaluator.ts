import { reverseString } from "src/helpers/reverse-string";
import { parseInitialNumberOrIdentifier } from "src/helpers/parse-initial-number-or-identifier";
import { NumberEvaluator } from "src/expression-evaluators/arithmetic-expressions/number-evaluator";
import { Scope } from "src/models/Scope";

export const numericComparisionEvaluator = (text: string, identifier: string, scope: Scope, comparator
    : (a1: any, a2: any) => boolean) => {
    const individualComponents = text.split(identifier);
    const reversedLhs = reverseString(individualComponents[0]);
    const extractedIdentifierOrNumber = parseInitialNumberOrIdentifier(reversedLhs, true);

    const lhs = reverseString(extractedIdentifierOrNumber);
    const rhs = parseInitialNumberOrIdentifier(individualComponents[1], false);

    const numberEvaluator = new NumberEvaluator(scope);

    if (numberEvaluator.tryEvaluate(lhs) === false ||
        numberEvaluator.tryEvaluate(rhs) === false) {
        throw new Error("Can't compare non-number symbols.");
    }

    const lhsNumber = numberEvaluator.evaluate(lhs);
    const rhsNumber = numberEvaluator.evaluate(rhs);

    const originalExpression = `${lhs}${identifier}${rhs}`;
    return text.replace(originalExpression, `${comparator(lhsNumber, rhsNumber)}`);
};
