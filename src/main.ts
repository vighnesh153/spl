import { preProcess } from "src/pre-processing/pre-processor";
import { LineOfCode } from "src/models/LineOfCode";
import { Interpreter } from "src/interpreter";
import { globalScope } from "src/global-scope";
import { OutputBuffer } from "src/models/OutputBuffer";
import { Scope } from "src/models/Scope";

export class Main {
    private linesOfCode: LineOfCode[];

    constructor(private code: string) {
        this.linesOfCode = [];
    }

    preProcess(): void {
        this.linesOfCode = preProcess(this.code);

        this.linesOfCode.forEach(loc => {
            if (loc.isIndentationValid() === false) {
                throw new Error('Indentation is invalid at line: ' + loc.number);
            }
        })
    }

    compile(scope?: Scope): void {
        try {
            this.preProcess();
            new Interpreter(this.linesOfCode.reverse(), scope ? scope as Scope : globalScope).interpret();
        } catch (e) {
            OutputBuffer.instance.push(e.message);
        }
    }

    getOutput(): string {
        return OutputBuffer.instance.getAndFlush();
    }
}
