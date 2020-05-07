import { Scope } from "src/models/Scope";
import { getPreviousAndNextNumberOrIdentifier } from "src/helpers/get-previous-and-next-number-or-identifier";

export const arithmeticOperationEvaluator =
    (text: string, identifier: string, scope: Scope,
     performOperation: (a1: any, a2: any) => number) => {
        const result = getPreviousAndNextNumberOrIdentifier(text, identifier, scope);
        return text.replace(
            result.originalExpression,
            `${performOperation(result.prev, result.next)}`
        );
    };
