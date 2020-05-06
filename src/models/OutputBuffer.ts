export class OutputBuffer {
    static instance: OutputBuffer = new OutputBuffer();
    private buffer: string[] = [];

    private constructor() {}

    push(data: string): void {
        this.buffer.push(data);
    }

    flush(): void {
        this.buffer = [];
    }

    getAndFlush(): string {
        const content = this.buffer.join('');
        this.flush();
        return content;
    }
}
