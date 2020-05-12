import { BlockParser } from "src/parsers/block-parsers/block-parser";
import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { Block } from "src/blocks/Block";

export class ContinueStatementParser extends BlockParser {
    private static regex = /^continue\s*$/;

    constructor(public scope: Scope, public lineOfCodes: LineOfCode[]) {
        super();
    }

    tryParse(): boolean {
        const lineUnderTest = this.lineOfCodes[this.lineOfCodes.length - 1];
        return ContinueStatementParser.regex.test(lineUnderTest.value);
    }

    parse(): Block {
        if (this.tryParse()) {
            const lineOfCodes = this.lineOfCodes;
            return new class extends Block {
                constructor(public scope: Scope) {
                    super();
                }

                execute(): void {
                    lineOfCodes.pop();
                    throw new Error('continue');
                }
            }(this.scope);
        }

        throw new Error('Invalid statement');
    }

}
