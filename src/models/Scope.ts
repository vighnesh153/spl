import { Variable } from "src/models/Variable";

import { bugReporter } from "src/language-bug-handling";

export class Scope {
    variables: { [key: string]: Variable } = {};
    parentScope: Scope | null = null;

    // functions
    // TODO

    constructor(parentScope?: Scope) {
        if (parentScope) {
            this.parentScope = parentScope as Scope;
        }
    }

    hasVariable(variableName: string): boolean {
        if (this.variables.hasOwnProperty(variableName)) {
            return true;
        }
        return this.parentScope === null
            ? false
            : (this.parentScope as Scope).hasVariable(variableName);
    }

    getVariable(variableName: string): Variable {
        if (this.variables.hasOwnProperty(variableName)) {
            return this.variables[variableName];
        } else if (this.parentScope !== null){
            return (this.parentScope as Scope).getVariable(variableName);
        } else {
            bugReporter.report('ACCESS_UNDEFINED_SYMBOL');

            // Unreachable return statement, anyway. Added just to make
            // Typescript happy because, it doesn't know that
            // the above line will throw error.
            return { type: '', value: 42 };
        }
    }
}
