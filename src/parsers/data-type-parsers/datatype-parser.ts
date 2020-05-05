export abstract class DatatypeParser {
    abstract type(): string;

    abstract parse(text: string): any;
    abstract tryParse(text: string): boolean
}
