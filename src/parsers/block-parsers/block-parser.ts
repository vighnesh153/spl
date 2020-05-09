import { Block } from "src/blocks/Block";
import { Scope } from "src/models/Scope";
import { LineOfCode } from "src/models/LineOfCode";

export abstract class BlockParser {
    abstract scope: Scope;
    abstract lineOfCodes: LineOfCode[];

    abstract tryParse(): boolean
    abstract parse(): Block;
}
