import { Scope } from "src/models/Scope";
import { Variable } from "../../src/models/Variable";

describe('check hasVariable functionality of scope.', () => {

    let scope: Scope;
    let variable: Variable;
    beforeEach(() => {
        scope = new Scope();
        variable = { type: 'any', value: 'any' };
    });

    test('should return false if identifier is absent.', () => {
        const result = scope.hasVariable('some identifier');
        expect(result).toStrictEqual(false);
    });

    test('should return true if identifier is present in current scope.', () => {
        scope.variables.identifierName = variable;

        const result = scope.hasVariable('identifierName');
        expect(result).toStrictEqual(true);
    });

    test('should return true if identifier is present in parent scope.', () => {
        const parentScope = new Scope();
        parentScope.variables.someIdentifier = variable;

        scope.parentScope = parentScope;

        const result = scope.hasVariable('someIdentifier');
        expect(result).toStrictEqual(true);
    });

    test('should return true if identifier is present in grand-parent scope.', () => {
        const grandParentScope = new Scope();
        grandParentScope.variables.someOtherIdentifier = variable;

        scope.parentScope = new Scope();
        scope.parentScope.parentScope = grandParentScope;

        const result = scope.hasVariable('someOtherIdentifier');
        expect(result).toStrictEqual(true);
    });
});

describe('check getVariable functionality of scope.', () => {

    let scope: Scope;
    let variable: Variable;
    beforeEach(() => {
        scope = new Scope();
        variable = { type: 'any', value: 'any' };
    });

    test('should return variable if it exists in current scope.', () => {
        scope.variables['variableName'] = variable;
        const result = scope.getVariable('variableName');
        expect(result).toStrictEqual(variable);
    });

    test('should return variable if it exists in parent scope.', () => {
        variable.value = 'Some random value';

        const parentScope = new Scope();
        parentScope.variables.someIdentifier = variable;

        scope.parentScope = parentScope;

        const result = scope.getVariable('someIdentifier');
        expect(result).toStrictEqual(variable);
    });

    test('should return variable if it exists in grand-parent scope.', () => {
        variable.value = 12445.32;

        const grandParentScope = new Scope();
        grandParentScope.variables.someOtherIdentifier = variable;

        scope.parentScope = new Scope();
        scope.parentScope.parentScope = grandParentScope;

        const result = scope.getVariable('someOtherIdentifier');
        expect(result).toStrictEqual(variable);
    });
});
