import { BlockParser } from "src/parsers/block-parsers/block-parser";
import { LineOfCode } from "src/models/LineOfCode";
import { Scope } from "src/models/Scope";
import { Block } from "src/blocks/Block";
import { ConditionBlock } from "src/blocks/condition-block";

export class ConditionalBlockParser extends BlockParser {
    private static ifRegex = /^if (.+),\s*then\s* do\s*:\s*$/;
    private static elseIfRegex = /^else\s* if (.+),\s*then\s* do\s*:\s*$/;
    private static elseRegex = /^else\s*,\s*do\s*:\s*$/;

    constructor(public lineOfCodes: LineOfCode[],
                public scope: Scope) {
        super();
    }

    tryParse(): boolean {
        const { conditions } = this.getBlocksAndConditions();
        return conditions.length > 0;
    }

    private getIndentedBlock(): LineOfCode[] {
        const block: LineOfCode[] = [];
        while (this.lineOfCodes.length > 0) {
            const lastLine = this.lineOfCodes[this.lineOfCodes.length - 1];
            if (lastLine.isInBlock()) {
                block.push(lastLine);
                this.lineOfCodes.pop();
            } else {
                break;
            }
        }
        return block;
    }

    private getBlocksAndConditions(): { blocks: LineOfCode[][], conditions: string[] } {
        const { ifRegex, elseIfRegex, elseRegex } = ConditionalBlockParser;
        let ifBlockConsumed = false;

        const conditions: string[] = [];
        const blocks: LineOfCode[][] = [];

        while (this.lineOfCodes.length > 0) {
            const lineUnderTest = this.lineOfCodes[this.lineOfCodes.length - 1];
            const countOfLinesBeforeParsing = this.lineOfCodes.length;

            if (ifBlockConsumed === false && ifRegex.test(lineUnderTest.value)) {
                ifBlockConsumed = true;
                const result = lineUnderTest.value.match(ifRegex);
                if (result) {
                    this.lineOfCodes.pop();
                    conditions.push(result[1]);
                    blocks.push(this.getIndentedBlock());
                }
            } else if (ifBlockConsumed && elseIfRegex.test(lineUnderTest.value)) {
                const result = lineUnderTest.value.match(elseIfRegex);
                if (result) {
                    this.lineOfCodes.pop();
                    conditions.push(result[1]);
                    blocks.push(this.getIndentedBlock());
                }
            } else if (ifBlockConsumed && elseRegex.test(lineUnderTest.value)) {
                this.lineOfCodes.pop();
                conditions.push('true');
                blocks.push(this.getIndentedBlock());
                break;
            } else {
                break;
            }

            const countOfLinesAfterParsing = this.lineOfCodes.length;

            if (countOfLinesBeforeParsing === countOfLinesAfterParsing) {
                throw new Error("Error in statement at line: " + lineUnderTest.number);
            }
        }

        return {
            blocks, conditions
        };
    }

    parse(): Block {
        const { blocks, conditions } = this.getBlocksAndConditions();
        return new ConditionBlock(conditions, blocks, this.scope);
    }

}
