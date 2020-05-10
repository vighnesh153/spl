import { Block } from "src/blocks/Block";
import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { BooleanExpressionEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-expression-evaluator";
import { Interpreter } from "src/interpreter";

export class ConditionBlock extends Block {

    private isAnyBlockEmpty() {
        return this.blocks.filter(b => b.length === 0).length !== 0
    }

    constructor(private conditions: string[],
                private blocks: LineOfCode[][],
                public scope: Scope) {
        super();

        if (this.isAnyBlockEmpty() ||
            conditions.length !== blocks.length) {
            throw new Error('Missing a block for a condition.');
        }
    }

    execute(): void {
        const evaluator = new BooleanExpressionEvaluator(this.scope);

        for (let i = 0; i < this.conditions.length; i++) {
            const condition = this.conditions[i];

            if (evaluator.tryEvaluate(condition) === false) {
                throw new Error('Invalid boolean expression.');
            }

            if (evaluator.evaluate(condition)) {
                new Interpreter(this.blocks[i], this.scope).interpret();
                return;
            }
        }
    }

}
