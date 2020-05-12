import { Block } from "src/blocks/Block";
import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { Interpreter } from "src/interpreter";
import { VariableBlock, VariableBlockType } from "src/blocks/variable-blocks/variable-block";
import { Variable } from "src/models/Variable";

export class ForEveryLoop extends Block {
    scope: Scope;
    array: Variable;

    constructor(private variableName: string,
                parentScope: Scope,
                private childLinesOfCode: LineOfCode[],
                arrayName: string,
                private indexName?: string) {
        super();
        this.scope = new Scope(parentScope);

        if (this.scope.hasVariable(arrayName) === false) {
            throw new Error(`'${arrayName}' variable doesn't exist`)
        }

        this.array = this.scope.getVariable(arrayName);
        if (this.array.type !== 'array') {
            throw new Error(`'${arrayName}' variable is not an iterable`);
        }
    }

    private setItemVariableTo(value: any, scope: Scope): void {
        const variableBlock = new VariableBlock(
            VariableBlockType.declare,
            this.variableName,
            this.array.arrayType as string,
            value,
            true,
            scope,
        );
        variableBlock.execute();
    }

    private setIndexVariableTo(n: number, scope: Scope): void {
        if (this.indexName) {
            const variableBlock = new VariableBlock(
                VariableBlockType.declare,
                this.indexName,
                'number',
                n,
                true,
                scope,
            );
            variableBlock.execute();
        }
    }

    execute(): void {
        for (let index = 0; index < this.array.value.length; index++) {
            const item = this.array.value[index];
            const newScope = this.scope.shallowClone();
            this.setItemVariableTo(item, newScope);
            this.setIndexVariableTo(index, newScope);

            try {
                new Interpreter(this.childLinesOfCode.slice(), newScope).interpret();
            } catch (e) {
                if (e.message === 'break') {
                    break;
                }
                if (e.message === 'continue') {
                    continue;
                }
                throw e;
            }
        }
    }

}
