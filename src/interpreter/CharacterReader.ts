class CharacterReader {
    command: string;
    position: number;

    constructor(command: string) {
        this.command = command;
        this.position = 0;
    }

    peek(chars = 1) {
        return this.command.substring(this.position, this.position + chars);
    }
    next(chars = 1) {
        if (this.position + chars >= this.command.length) {
            this.position = this.command.length - 1;
        } else {
            this.position += chars;
        }
    }
    hasNext() {
        return this.position < this.command.length;
    }
}
