import { Block } from "src/blocks/Block";
import { Scope } from "src/models/Scope";

export enum VariableBlockType {
    declare, set
}

export class VariableBlock extends Block {
    constructor(public typeOfBlock: VariableBlockType,
                public variableName: string,
                public typeOfVariable: string,
                public value: any,
                public isPermanent: boolean) {
        super();
    }

    private declare(scope: Scope): void {
        if (scope.hasVariable(this.variableName)) {
            throw new Error('Trying to declare existing variable.');
        }
        scope.variables[this.variableName] = {
            type: this.typeOfVariable,
            value: this.value,
            isPermanent: this.isPermanent
        }
    }

    private set(scope: Scope): void {
        if (scope.hasVariable(this.variableName) === false) {
            throw new Error('Trying to set value of not-declared variable.')
        } else {
            const variable = scope.getVariable(this.variableName);
            if (variable.isPermanent) {
                throw new Error('Tried to modify a permanent variable.')
            }
            scope.getVariable(this.variableName).value = this.value;
        }
    }

    execute(scope: Scope): void {
        if (this.typeOfBlock === VariableBlockType.declare) {
            this.declare(scope);
        } else {
            this.set(scope);
        }
    }
}
