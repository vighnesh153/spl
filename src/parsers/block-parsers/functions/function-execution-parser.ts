import { BlockParser } from "src/parsers/block-parsers/block-parser";
import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { Block } from "src/blocks/Block";
import { FunctionExpressionEvaluator } from "src/expression-evaluators/function-expression-evaluator";

export class FunctionExecutionParser extends BlockParser {
    private static regex = /^execute (.*)\((.*)\)\s*$/;

    constructor(public scope: Scope, public lineOfCodes: LineOfCode[]) {
        super();
    }

    tryParse(): boolean {
        const lineUnderTest = this.lineOfCodes[this.lineOfCodes.length - 1];
        return FunctionExecutionParser.regex.test(lineUnderTest.value.trim());
    }

    parse(): Block {
        const evaluator = new FunctionExpressionEvaluator(this.scope);
        const lineOfCodes = this.lineOfCodes;
        const lineUnderTest = this.lineOfCodes[this.lineOfCodes.length - 1];

        return new class extends Block {
            constructor(public scope: Scope) {
                super();
            }

            execute(): void {
                try {
                    lineOfCodes.pop();
                    evaluator.evaluate(lineUnderTest.value.replace(
                            'execute',
                            'result of'
                    ));
                } catch (e) {
                    if (e.message !== 'Function returns nothing according to definition.') {
                        throw e;
                    }
                }
            }
        }(this.scope);
    }

}
