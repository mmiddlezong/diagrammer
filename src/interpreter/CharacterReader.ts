class CharacterReader {
    command: string;
    position: number;

    constructor(command: string) {
        this.command = command;
        this.position = 0;
    }

    peek(length = 1) {
        return this.command.substring(this.position, this.position + length);
    }
    jump(length = 1) {
        if (this.position + length >= this.command.length) {
            this.position = this.command.length - 1;
        } else {
            this.position += length;
        }
    }
    hasNext() {
        return this.position < this.command.length;
    }
}
