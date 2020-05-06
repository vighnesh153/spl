import { Scope } from "src/models/Scope";

export abstract class Block {
    abstract execute(scope: Scope): void;
}
