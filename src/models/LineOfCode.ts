import { bugReporter } from "src/language-bug-handling";

export class LineOfCode {
    constructor(public value: string, public number: number) {
        throw new Error('Not implemented: isIndentationValid');
    }

    // returns true if it has 4 space characters in the beginning
    isInBlock(): boolean {
        return this.value.startsWith('    ');
    }

    // removes the first 4 space characters
    decreaseBlockLevel() {
        if (this.isInBlock()) {
            this.value = this.value.substring(4)
        } else {
            bugReporter.report("BLOCK_LEVEL_CHOP_NON_BLOCK");
        }
    }

    isIndentationValid() {
        // TODO: check if count of spaces is multiples of 4
    }
}
