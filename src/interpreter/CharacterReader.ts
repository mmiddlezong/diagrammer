export default class CharacterReader {
    command: string;
    position: number;

    constructor(command: string) {
        this.command = command;
        this.position = 0;
    }

    peek(chars = 1): string {
        if (this.position + chars >= this.command.length) {
            return this.command.substring(this.position);
        }
        return this.command.substring(this.position, this.position + chars);
    }
    next(chars = 1): string {
        const returnValue = this.peek(chars);
        if (this.position + chars >= this.command.length) {
            this.position = this.command.length;
        } else {
            this.position += chars;
        }
        return returnValue;
    }
    hasNext() {
        return this.position < this.command.length;
    }
}
