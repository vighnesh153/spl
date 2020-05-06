import { VariableBlock, VariableBlockType } from "src/blocks/variable-block";

import { Scope } from "src/models/Scope";
import { Block } from "../../src/blocks/Block";

describe('check functionality of variable block', () => {

    let variableBlock: Block;
    beforeEach(() => {
        variableBlock = new VariableBlock(
            VariableBlockType.declare,
            'Some Variable Name',
            'number',
            123.456,
            false,
            new Scope()
        );
    });

    test('should declare a variable in scope when ' +
        'executed on a declaration VariableBlock', () => {

        variableBlock.execute();
        const variable = variableBlock.scope.getVariable('Some Variable Name');

        expect(variable.value).toStrictEqual(123.456);
        expect(variable.isPermanent).toStrictEqual(false);
    });

    test('should modify variable in scope when ' +
        'executed on a set VariableBlock', () => {

        // Declaration
        variableBlock.execute();

        // Set
        variableBlock = new VariableBlock(
            VariableBlockType.set,
            'Some Variable Name',
            'number',
            456.123,
            false,
            variableBlock.scope
        );
        variableBlock.execute();

        const variable = variableBlock.scope.getVariable('Some Variable Name');

        expect(variable.value).toStrictEqual(456.123);
    });
});
