import { DatatypeParser } from "../datatype-parser";

import { NumberParser } from "../primitive-parsers/number-parser";
import { BooleanParser } from "../primitive-parsers/boolean-parser";
import { StringParser } from "../primitive-parsers/string-parser";

import { bugReporter } from "src/language-bug-handling";

export class ArrayParser extends DatatypeParser {
    primitiveParsers: DatatypeParser[] = [
        new NumberParser(),
        new BooleanParser(),
        new StringParser()
    ];

    type(): string {
        return "array";
    }

    tryParse(text: string): boolean {
        const trimmed = text.trim();

        if (trimmed.startsWith('[') === false ||
            trimmed.endsWith(']') === false) {
            return false;
        }

        const innerContent = trimmed.slice(1, trimmed.length - 1).trim();
        if (innerContent.length === 0) {
            return true;
        }

        const arrayElements = innerContent.split(',');
        let type: string = 'any';
        let isArrayValid = true;
        arrayElements.forEach(element => {
            if (isArrayValid === false) return;
            let parsedByAny = false;

            this.primitiveParsers.forEach(parser => {
                if (isArrayValid === false) return;

                if (parser.tryParse(element)) {
                    if (type === 'any') {
                        type = parser.type();
                    } else if (type !== parser.type()) {
                        isArrayValid = false;
                    }
                    parsedByAny = true;
                }
            });

            if (parsedByAny === false) isArrayValid = false;
        });

        return isArrayValid;
    }

    parse(text: string): any {
        if (this.tryParse(text)) {
            const trimmed = text.trim();
            const innerContent = trimmed.slice(1, trimmed.length - 1).trim();
            const resultantArray: any[] = [];

            innerContent.split(',').forEach(element => {
                let isParsedAlready = false;
                this.primitiveParsers.forEach(parser => {
                    if (isParsedAlready) return;
                    if (parser.tryParse(element)) {
                        resultantArray.push(parser.parse(element));
                        isParsedAlready = true;
                    }
                });
            });

            return resultantArray;
        } else {
            bugReporter.report('PARSE_INVOKED_ON_INVALID_ARRAY')
        }
    }

}
