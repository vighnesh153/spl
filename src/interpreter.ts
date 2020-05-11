import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { BlockParser } from "src/parsers/block-parsers/block-parser";
import { VariableDeclarationParser } from "src/parsers/block-parsers/variable-statements-parser/variable-declaration-parser";
import { VariableModificationParser } from "src/parsers/block-parsers/variable-statements-parser/variable-modification-parser";
import { DisplayStatementsParser } from "src/parsers/block-parsers/display-statements-parser";
import { ConditionalBlockParser } from "src/parsers/block-parsers/conditional-block-parser";
import { LoopForXTimesParser } from "src/parsers/block-parsers/loop-parsers/loop-for-x-times-parser";
import { LoopWhileExpressionIsTrueParser } from "src/parsers/block-parsers/loop-parsers/loop-while-expression-is-true-parser";
import { ForEveryLoopParser } from "src/parsers/block-parsers/loop-parsers/for-every-loop-parser";
import { ReturnParser } from "src/parsers/block-parsers/functions/return-parser";

/*
 *
 *  Note: When instantiating the interpreter for the first time
 *        in the main file, DONT FORGET TO ADD THE LINES OF CODE IN
 *        REVERSED ORDER BECAUSE PROCESSING BEGINS FROM THE END.
 *
 */


export class Interpreter {
    private readonly blockParsers: BlockParser[] = [];

    private createCopyOfLinesOfCode(): void {
        const copy: LineOfCode[] = [];
        for (const loc of this.linesOfCode) {
            const newLoc = new LineOfCode(loc.value, loc.number);
            copy.push(newLoc);
        }
        this.linesOfCode = copy;
    }

    constructor(private linesOfCode: LineOfCode[],
                private scope: Scope) {

        this.createCopyOfLinesOfCode();

        this.blockParsers.push(new ReturnParser(this.scope, this.linesOfCode));

        this.blockParsers.push(new VariableDeclarationParser(this.scope, this.linesOfCode));
        this.blockParsers.push(new VariableModificationParser(this.scope, this.linesOfCode));
        this.blockParsers.push(new DisplayStatementsParser(this.scope, this.linesOfCode));

        this.blockParsers.push(new ConditionalBlockParser(this.linesOfCode, this.scope));
        this.blockParsers.push(new LoopForXTimesParser(this.linesOfCode, this.scope));
        this.blockParsers.push(new LoopWhileExpressionIsTrueParser(this.linesOfCode, this.scope));
        this.blockParsers.push(new ForEveryLoopParser(this.linesOfCode, this.scope));
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
            const lineUnderExecution = this.linesOfCode[this.linesOfCode.length - 1].number;

            for (const parser of this.blockParsers) {
                if (parser.tryParse()) {
                    try {
                        const block = parser.parse();
                        block.execute();
                        break;
                    } catch (e) {
                        if (['return', 'break', 'continue'].includes(e.message)) {
                            throw e;
                        }
                        if (e.message.includes('line:')) {
                            throw new Error(e.message)
                        } else {
                            throw new Error(e.message + '. At line: ' + lineUnderExecution);
                        }
                    }
                }
            }

            const countOfLinesAfterParsing = this.linesOfCode.length;

            if (countOfLinesBeforeParsing === countOfLinesAfterParsing) {
                const lastLine = this.linesOfCode[this.linesOfCode.length - 1];
                throw new Error("Error in statement at line: " + lastLine.number);
            }
        }
    }
}
