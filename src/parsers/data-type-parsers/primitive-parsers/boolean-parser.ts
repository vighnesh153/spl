import { DatatypeParser } from "../datatype-parser";
import { bugReporter } from "../../../language-bug-handling";

export class BooleanParser extends DatatypeParser {
    type(): string {
        return "boolean";
    }

    tryParse(text: string): boolean {
        const trimmed = text.trim();

        return ['true', 'false'].includes(trimmed);
    }

    parse(text: string): any {
        if (this.tryParse(text)) {
            return JSON.parse(text);
        } else {
            bugReporter.report('PARSE_CALLED_ON_INVALID_BOOL_STRING');
        }
    }
}
