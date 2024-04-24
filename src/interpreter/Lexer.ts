import CharacterReader from "./CharacterReader";
import { readCommaToken, readNameToken, readNumberToken, readOperatorToken, readParenthesisToken, readWhitespaceToken } from "./TokenDetectors";

export interface Token {
    type: string;
    value?: string;
    start: number;
    end: number;
}
export interface TokenValue {
    type: string;
    value?: string;
}
type TokenDetector = (reader: CharacterReader) => TokenValue | null;

const tokenDetectors: TokenDetector[] = [
    readNumberToken,
    readOperatorToken,
    readNameToken,
    readParenthesisToken,
    readCommaToken,
    readWhitespaceToken,
];

export function tokenize(command: string) {
    const reader = new CharacterReader(command);
    const tokens: Token[] = [];

    const MAX_ITERS = 10000;
    let iters = 0;
    while (reader.hasNext() && iters++ < MAX_ITERS) {
        let tokenValue: TokenValue | null = null;

        const startPosition = reader.position;
        for (const detectToken of tokenDetectors) {
            tokenValue = detectToken(reader);
            if (tokenValue) {
                break;
            }
        }

        if (!tokenValue) {
            // syntax error
            throw new Error("Syntax error");
        }

        tokens.push({ ...tokenValue, start: startPosition, end: reader.position });
    }

    if (iters == MAX_ITERS) {
        throw new Error("Max iters reached");
    }

    // Remove whitespace tokens
    return tokens.filter((i) => i.type !== "whitespace");
}
