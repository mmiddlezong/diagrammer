import CharacterReader from "./CharacterReader";
import { TokenValue } from "./Lexer";

export function readNumberToken(reader: CharacterReader): TokenValue | null {
    if (!reader.hasNext()) return null;
    const firstChar = reader.peek(1);

    // Check if the first character is part of a number (digits, negative sign, or decimal point)
    if (!/[\d.-]/.test(firstChar)) return null; // Not starting with a digit, negative sign, or decimal point

    let number = "";
    let hasDecimal = false;

    while (reader.hasNext()) {
        const char = reader.peek();
        if (char === ".") {
            if (hasDecimal) {
                // Already encountered a decimal point, break to prevent numbers like "1.2.3"
                break;
            }
            hasDecimal = true;
        } else if (!/\d/.test(char)) {
            // Break on encountering a non-digit after starting the number
            break;
        }

        number += char;
        reader.next();
    }

    // Validate the collected number string
    if (!/^[-]?(\d+\.?\d*|\.\d+)$/.test(number)) {
        // If the number does not match a valid pattern, return undefined
        return null;
    }

    return { type: "number", value: number };
}
export function readParenthesisToken(reader: CharacterReader): TokenValue | null {
    if (!reader.hasNext()) return null;
    const char = reader.peek(1);

    // Check if the character is a parenthesis
    if (char === "(") {
        reader.next(); // Consume the character
        return { type: "parenStart", value: "(" };
    } else if (char === ")") {
        reader.next(); // Consume the character
        return { type: "parenEnd", value: ")" };
    }

    // If not a parenthesis, return null
    return null;
}
export function readCommaToken(reader: CharacterReader): TokenValue | null {
    if (!reader.hasNext()) return null;
    const char = reader.peek(1);

    // Check if the character is a comma
    if (char === ",") {
        reader.next(); // Consume the character
        return { type: "comma", value: "," };
    }

    // If not a comma, return null
    return null;
}
export function readNameToken(reader: CharacterReader): TokenValue | null {
    let value = "";
    const startOfVariableMatch = /[a-zA-Z]/;
    const restOfVariableMatch = /[_a-zA-Z0-9]/;

    // If we did not match the variable, do not return a token.
    if (!reader.peek().match(startOfVariableMatch)) {
        return null;
    }

    value = reader.peek();
    reader.next();

    while (reader.hasNext() && reader.peek().match(restOfVariableMatch)) {
        // add a character to the value as long as we match the variable name.
        value += reader.peek();
        reader.next();
    }

    // we return a variable token
    return { type: "name", value };
}
export function readOperatorToken(reader: CharacterReader): TokenValue | null {
    if (!reader.hasNext()) return null;
    const char = reader.peek(1);
    if (/=/.test(char)) {
        reader.next();
        return { type: "operator", value: char };
    }
    return null;
}
export function readWhitespaceToken(reader: CharacterReader): TokenValue | null {
    if (!reader.hasNext()) return null;
    const char = reader.peek(1);

    // Check if the initial character is a whitespace
    if (!/\s/.test(char)) return null; // If the first character is not a whitespace, return null

    let whitespace = "";

    // Accumulate all contiguous whitespace characters
    while (reader.hasNext() && /\s/.test(reader.peek())) {
        whitespace += reader.next(); // Append the character and move to the next
    }

    return { type: "whitespace", value: whitespace };
}
