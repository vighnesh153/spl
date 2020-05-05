import { PrimitiveParser } from "./primitive-parser";
import { bugReporter } from "../../language-bug-handling";

export class NumberParser extends PrimitiveParser {
    type(): string {
        return "number";
    }

    tryParse(text: string): boolean {
        const trimmed = text.trim();
        if (trimmed === "") {
            return false;
        }

        return isNaN(Number(trimmed)) === false;
    }

    parse(text: string): any {
        if (this.tryParse(text)) {
            return Number(text);
        } else {
            bugReporter.report('PARSE_CALLED_ON_NOT_VALID_NUMBER');
        }
    }
}
