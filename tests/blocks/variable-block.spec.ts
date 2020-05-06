import { VariableBlock, VariableBlockType } from "src/blocks/variable-block";

import { Scope } from "src/models/Scope";

describe('check declare functionality of variable block', () => {

    let variableBlock: VariableBlock;
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
        variableBlock.typeOfBlock = VariableBlockType.set;
        variableBlock.value = 456.123;
        variableBlock.execute();

        const variable = variableBlock.scope.getVariable('Some Variable Name');

        expect(variable.value).toStrictEqual(456.123);
    });
});
