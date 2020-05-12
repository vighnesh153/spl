import { Block } from "src/blocks/Block";
import { LineOfCode } from "src/models/LineOfCode";
import { Scope } from "src/models/Scope";
import { existingKeywords } from "src/helpers/existing-keywords";
import { isValidIdentifier } from "src/helpers/is-valid-identifier";
import { Variable } from "src/models/Variable";
import { Interpreter } from "src/interpreter";
import { VariableDeclarationParser } from "src/parsers/block-parsers/variable-statements-parser/variable-declaration-parser";
import { ArithmeticExpressionEvaluator } from "src/expression-evaluators/arithmetic-expressions/arithmetic-expression-evaluator";
import { BooleanExpressionEvaluator } from "src/expression-evaluators/boolean-expressions/boolean-expression-evaluator";
import { StringExpressionEvaluator } from "src/expression-evaluators/string-expression-evaluator";
import { ArrayExpressionEvaluator } from "src/expression-evaluators/array-expression-evaluator";
import { ExpressionEvaluator } from "src/expression-evaluators/expression-evaluator";
import { ReturnError } from "src/models/ReturnError";

export class FunctionBlock extends Block {
    scope: Scope;
    private readonly expressionEvaluators: { [key: string]: (scope: Scope) => ExpressionEvaluator } = {};

    private result: Variable | undefined;
    argv: string[] = [];
    evaluationScope: Scope = new Scope();

    public static define(funcBlock: FunctionBlock, scope: Scope): void {
        if (scope.hasFunction(funcBlock.functionName)) {
            throw new Error(`Function '${funcBlock.functionName}' already exists.`);
        }
        scope.functions[funcBlock.functionName] = funcBlock;
    }

    constructor(public readonly functionName: string,
                private functionArguments: string[],
                private chileLinesOfCode: LineOfCode[],
                parentScope: Scope,
                private shouldReturnSomething: boolean,
                private returnType: string) {
        super();

        this.scope = new Scope(parentScope);

        this.expressionEvaluators.number = (scope: Scope) => new ArithmeticExpressionEvaluator(scope);
        this.expressionEvaluators.boolean = (scope: Scope) => new BooleanExpressionEvaluator(scope);
        this.expressionEvaluators.string = (scope: Scope) => new StringExpressionEvaluator(scope);
        this.expressionEvaluators["array of number"] = (scope: Scope) => new ArrayExpressionEvaluator(scope);
        this.expressionEvaluators["array of boolean"] = this.expressionEvaluators["array of number"];
        this.expressionEvaluators["array of string"] = this.expressionEvaluators["array of number"];

        this.functionName = this.functionName.trim();

        if (existingKeywords.has(this.functionName)) {
            throw new Error(`'${this.functionName}' is a keyword and can't be used as an identifier.`)
        }

        if (isValidIdentifier(this.functionName) === false) {
            throw new Error(`'${this.functionName}' is not a valid identifier name.`)
        }
    }

    getResult(): Variable {
        if (this.shouldReturnSomething === false) {
            throw 'Function returns nothing according to definition.';
        }
        if (this.result === undefined) {
            throw 'Function didn\'t return anything.';
        }
        const result = this.result as Variable;
        this.result = undefined;
        return result;
    }

    private static tryDefine(typeAndName: string, value: string, scope: Scope, evalScope: Scope): void {
        const components =  typeAndName.split(' ');
        let loc = '';
        if (components.length !== 2 && components.length !== 4) {
            throw new Error("Can't be parsed.");
        }
        if (components.length === 2) {
            loc = `let ${typeAndName} be ${value}`;
        }
        if (components.length === 4) {
            loc = `let array of ${components[2]}, ${components[3]}, be ${value}`;
        }
        const lineOfCode = new LineOfCode(loc, Math.random());
        const parser = new VariableDeclarationParser(scope, [lineOfCode], evalScope);
        if (parser.tryParse() === false) {
            throw new Error("Can't be parsed.");
        }
        const block = parser.parse();
        block.execute();
    }

    execute(): void {
        if (this.functionArguments.length !== this.argv.length) {
            throw new Error(`Expected ${this.functionArguments.length} arguments ` +
                `but got ${this.argv.length} instead.`);
        }
        const newScope = this.scope.shallowClone();

        for (let i = 0; i < this.functionArguments.length; i++) {
            try {
                FunctionBlock.tryDefine(this.functionArguments[i], this.argv[i], newScope, this.evaluationScope);
            } catch (e) {
                throw new Error(`Invalid argument declaration or assignment: ` +
                    `${this.functionArguments[i]} <= ${this.argv[i]}.`);
            }
        }

        try {
            new Interpreter(this.chileLinesOfCode.slice(), newScope).interpret();
        } catch (e) {
            if (e.message !== 'return') {
                throw e;
            }

            try {
                if (this.shouldReturnSomething) {
                    const returnError = e as ReturnError;
                    const result = returnError.value;

                    const components = this.returnType.split(' ');
                    const scope: Scope = returnError.scope;

                    if (this.expressionEvaluators[this.returnType](scope).tryEvaluate(result) === false) {
                        throw new Error('Invalid data returned.');
                    }
                    this.result = {
                        value: this.expressionEvaluators[this.returnType](scope).evaluate(result),
                        isPermanent: false,
                        type: components.length > 1 ? 'array' : this.returnType
                    }
                    if (components.length > 1) {
                        if (components[2] !== (new ArrayExpressionEvaluator(scope)).getType(result)) {
                            throw new Error('Invalid data returned.');
                        }
                        this.result.arrayType = components[2];
                    }
                }
            } catch (e) {
                throw new Error('Invalid data returned.');
            }
        }

        this.argv = [];
    }
}
