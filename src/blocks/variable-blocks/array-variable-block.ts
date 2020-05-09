import { VariableBlock, VariableBlockType } from "src/blocks/variable-blocks/variable-block";
import { Scope } from "src/models/Scope";

export class ArrayVariableBlock extends VariableBlock {
    constructor(public typeOfBlock: VariableBlockType,
                public variableName: string,
                public typeOfVariable: string,
                public value: any,
                public isPermanent: boolean,
                parentScope: Scope,
                public typeOfArray: string) {
        super(typeOfBlock, variableName, typeOfVariable, value, isPermanent, parentScope);
    }

    protected set(): void {
        if (this.scope.hasVariable(this.variableName) === false) {
            throw new Error('Trying to set value of not-declared variable.')
        } else {
            const variable = this.scope.getVariable(this.variableName);
            if (variable.isPermanent) {
                throw new Error('Tried to modify a permanent variable.')
            }
            this.scope.getVariable(this.variableName).value = this.value;
        }
    }
}
