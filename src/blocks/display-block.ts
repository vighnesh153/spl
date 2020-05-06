import { Block } from "src/blocks/Block";
import { Scope } from "src/models/Scope";

import { OutputBuffer } from "src/models/OutputBuffer";

import { DatatypeParser } from "src/parsers/data-type-parsers/datatype-parser";
import { BooleanParser } from "src/parsers/data-type-parsers/primitive-parsers/boolean-parser";
import { NumberParser } from "src/parsers/data-type-parsers/primitive-parsers/number-parser";
import { StringParser } from "src/parsers/data-type-parsers/primitive-parsers/string-parser";
import { ArrayParser } from "src/parsers/data-type-parsers/non-primitive-parsers/array-parser";

export class DisplayBlock extends Block {
    scope: Scope;

    private static parsers: DatatypeParser[] = [
        BooleanParser.instance,
        NumberParser.instance,
        StringParser.instance,
        ArrayParser.instance
    ];

    constructor(private values: string[], parentScope: Scope) {
        super();
        this.scope = parentScope;
    }

    execute(): void {
        const outputBuffer = OutputBuffer.instance;

        for (const value of this.values) {
            let isLiteral = false;
            for (const parser of DisplayBlock.parsers) {
                if (parser.tryParse(value)) {
                    isLiteral = true;
                    const stringForm = parser.parse(value).toString();
                    outputBuffer.push(stringForm);
                    break;
                }
            }
            if (isLiteral === false) {
                if (this.scope.hasVariable(value)) {
                    const variable = this.scope.getVariable(value);
                    outputBuffer.push(variable.value.toString());
                } else {
                    throw new Error("Cannot resolve symbol: " + value);
                }
            }
        }

        outputBuffer.push('\n');
    }

}
