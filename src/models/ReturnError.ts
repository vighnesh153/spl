import { Scope } from "src/models/Scope";

export class ReturnError extends Error {
    constructor(public message: string, public scope: Scope, public value: string) {
        super();
    }
}
