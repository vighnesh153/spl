import { Scope } from "src/models/Scope";
import { getPreviousAndNextNumberOrIdentifier } from "src/helpers/get-previous-and-next-number-or-identifier";

export const numericComparisionEvaluator =
    (text: string, identifier: string, scope: Scope,
     comparator: (a1: any, a2: any) => boolean) => {
        const result = getPreviousAndNextNumberOrIdentifier(text, identifier, scope);
        return text.replace(
            result.originalExpression,
            `${comparator(result.prev, result.next)}`
        );
    };
