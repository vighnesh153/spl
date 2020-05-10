import { Block } from "src/blocks/Block";
import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { Interpreter } from "src/interpreter";
import { VariableBlock, VariableBlockType } from "src/blocks/variable-blocks/variable-block";

export class LoopForXTimes extends Block {
    scope: Scope;

    protected hasCounterVariable = false;
    protected counterVariableName = 'DUMMY';

    constructor(private numberOfTimes: number,
                parentScope: Scope,
                private childLinesOfCode: LineOfCode[],
                counterVariableName?: string) {
        super();
        this.scope = new Scope(parentScope);

        if (counterVariableName) {
            this.hasCounterVariable = true;
            this.counterVariableName = counterVariableName as string;
        }
    }

    private setCounterVariableTo(n: number, scope: Scope): void {
        const variableBlock = new VariableBlock(
            VariableBlockType.declare,
            this.counterVariableName,
            'number',
            n,
            true,
            scope,
        );
        variableBlock.execute();
    }

    execute(): void {
        for (let counter = 0; counter < this.numberOfTimes; counter++) {
            const newScope = this.scope.shallowClone();
            if (this.hasCounterVariable) {
                this.setCounterVariableTo(counter + 1, newScope);
            }
            new Interpreter(this.childLinesOfCode.slice(), newScope).interpret();
        }
    }

}
