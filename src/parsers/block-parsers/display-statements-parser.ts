import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { BlockParser } from "src/parsers/block-parsers/block-parser";

import { Block } from "src/blocks/Block";
import { DisplayBlock } from "src/blocks/display-block";


export class DisplayStatementsParser extends BlockParser {
    private static regex = /^display\s* (.*)$/;


    constructor(public scope: Scope,
                public lineOfCodes: LineOfCode[]) {
        super();
    }

    tryParse(): boolean {
        const lineUnderTest = this.lineOfCodes[this.lineOfCodes.length - 1];
        return DisplayStatementsParser.regex.test(lineUnderTest.value.trimRight());
    }

    parse(): Block {
        if (this.tryParse()) {
            const lineUnderTest = this.lineOfCodes[this.lineOfCodes.length - 1];

            const result = lineUnderTest.value.trimRight()
                .match(DisplayStatementsParser.regex);
            if (result) {
                // const values = result[1].split(',');
                // return new DisplayBlock(values, this.scope);
                return new DisplayBlock([result[1]], this.scope);
            }

            throw new Error(`Display statement can't be empty. At line: ` +
                this.lineOfCodes[this.lineOfCodes.length - 1].number);
        }
        throw new Error('There is some error in display statement at line: ' +
            this.lineOfCodes[this.lineOfCodes.length - 1].number);
    }

}
