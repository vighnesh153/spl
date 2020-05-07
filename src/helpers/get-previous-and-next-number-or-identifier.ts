import { reverseString } from "src/helpers/reverse-string";
import { parseInitialNumberOrIdentifier } from "src/helpers/parse-initial-number-or-identifier";
import { NumberEvaluator } from "src/expression-evaluators/arithmetic-expressions/number-evaluator";
import { Scope } from "src/models/Scope";

export const getPreviousAndNextNumberOrIdentifier =
    (text: string, operator: string, scope: Scope):
        { prev: number, next: number, originalExpression: string } => {
        const individualComponents = text.split(operator);
        const reversedLhs = reverseString(individualComponents[0]);
        const extractedIdentifierOrNumber = parseInitialNumberOrIdentifier(reversedLhs, true);

        const lhs = reverseString(extractedIdentifierOrNumber);
        const rhs = parseInitialNumberOrIdentifier(individualComponents[1], false);

        const numberEvaluator = new NumberEvaluator(scope);

        if (numberEvaluator.tryEvaluate(lhs) === false ||
            numberEvaluator.tryEvaluate(rhs) === false) {
            throw new Error("Can't compare non-number symbols.");
        }

        return {
            prev: numberEvaluator.evaluate(lhs),
            next: numberEvaluator.evaluate(rhs),
            originalExpression: `${lhs}${operator}${rhs}`
        };
    }
