import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { BlockParser } from "src/parsers/block-parsers/block-parser";
import { VariableDeclarationParser } from "src/parsers/block-parsers/variable-statements-parser/variable-declaration-parser";
import { VariableModificationParser } from "src/parsers/block-parsers/variable-statements-parser/variable-modification-parser";
import { DisplayStatementsParser } from "src/parsers/block-parsers/display-statements-parser";

/*
 *
 *  Note: When instantiating the interpreter for the first time
 *        in the main file, DONT FORGET TO ADD THE LINES OF CODE IN
 *        REVERSED ORDER BECAUSE PROCESSING BEGINS FROM THE END.
 *
 */


export class Interpreter {
    private readonly blockParsers: BlockParser[] = [];

    constructor(private linesOfCode: LineOfCode[],
                private scope: Scope) {

        this.blockParsers.push(new VariableDeclarationParser(this.scope, this.linesOfCode));
        this.blockParsers.push(new VariableModificationParser(this.scope, this.linesOfCode));
        this.blockParsers.push(new DisplayStatementsParser(this.scope, this.linesOfCode));
    }

    interpret(): void {
        if (this.linesOfCode.length === 0) {
            return;
        }

        {
            const lastLine = this.linesOfCode[this.linesOfCode.length - 1];
            if (lastLine.isInBlock()) {
                this.linesOfCode.forEach(line => line.decreaseBlockLevel());
            }
        }

        while (this.linesOfCode.length > 0) {
            const countOfLinesBeforeParsing = this.linesOfCode.length;

            for (const parser of this.blockParsers) {
                if (parser.tryParse()) {
                    const block = parser.parse();
                    block.execute();
                    break;
                }
            }

            const countOfLinesAfterParsing = this.linesOfCode.length;

            if (countOfLinesBeforeParsing === countOfLinesAfterParsing) {
                const lastLine = this.linesOfCode[this.linesOfCode.length - 1];
                throw new Error("Cannot process statement at line: " + lastLine.number);
            }
        }
    }
}
