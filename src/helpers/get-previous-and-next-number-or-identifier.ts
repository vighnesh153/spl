import { reverseString } from "src/helpers/reverse-string";
import { parseInitialNumberOrIdentifier } from "src/helpers/parse-initial-number-or-identifier";
import { Scope } from "src/models/Scope";
import { ArithmeticExpressionEvaluator } from "src/expression-evaluators/arithmetic-expressions/arithmetic-expression-evaluator";

export const getPreviousAndNextNumberOrIdentifier =
    (text: string, operator: string, scope: Scope):
        { prev: number, next: number, originalExpression: string } => {
        const individualComponents = text.split(operator);
        const reversedLhs = reverseString(individualComponents[0]);
        const extractedIdentifierOrNumber = parseInitialNumberOrIdentifier(reversedLhs, true);

        const lhs = reverseString(extractedIdentifierOrNumber);
        const rhs = parseInitialNumberOrIdentifier(individualComponents[1], false);

        const arithmeticExpressionEvaluator = new ArithmeticExpressionEvaluator(scope);

        if (arithmeticExpressionEvaluator.tryEvaluate(lhs) === false ||
            arithmeticExpressionEvaluator.tryEvaluate(rhs) === false) {
            throw new Error("Can't compare non-number symbols.");
        }

        return {
            prev: arithmeticExpressionEvaluator.evaluate(lhs),
            next: arithmeticExpressionEvaluator.evaluate(rhs),
            originalExpression: `${lhs}${operator}${rhs}`
        };
    }
