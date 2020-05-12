import { Block } from "src/blocks/Block";
import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";
import { Interpreter } from "src/interpreter";
import { BooleanExpressionEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-expression-evaluator";

export class LoopWhileExpressionIsTrue extends Block {
    scope: Scope;

    constructor(private expression: string,
                parentScope: Scope,
                private childLinesOfCode: LineOfCode[]) {
        super();
        this.scope = new Scope(parentScope);
    }

    execute(): void {
        const evaluator = new BooleanExpressionEvaluator(this.scope);

        const throwIfExpressionIsInvalid = () => {
            if (evaluator.tryEvaluate(this.expression) === false) {
                throw new Error('Invalid boolean expression.');
            }
        }

        throwIfExpressionIsInvalid();
        while (evaluator.evaluate(this.expression)) {
            try {
                new Interpreter(this.childLinesOfCode.slice(), this.scope.shallowClone()).interpret();
            } catch (e) {
                if (e.message === 'break') {
                    break;
                }
                if (e.message === 'continue') {
                    continue;
                }
                throw e;
            }
            throwIfExpressionIsInvalid();
        }
    }

}
