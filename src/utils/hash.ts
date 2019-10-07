declare let Uint8Array: Uint8ArrayConstructor;
/**
 * Convert given ArrayBuffer to HEX-string.
 * @param buffer
 */
export function hexString(buffer: ArrayBuffer) {
    const byteArray = new Uint8Array(buffer);

    const hexCodes = [...byteArray].map((value) => {
        const hexCode = value.toString(16);
        const paddedHexCode = hexCode.padStart(2, '0');
        return paddedHexCode;
    });

    return hexCodes.join('');
}

/**
 * Digest the given message. ArrayBuffer result is returned in a Promise.
 * @param message
 */
export function digestMessage(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    return window.crypto.subtle.digest('SHA-256', data);
}

/**
 * Returns digest of given message in the form of a HEX-string.
 * @param message
 */
export async function digest(message: string) {
    const arrayBuffer = await digestMessage(message);
    const hex = hexString(arrayBuffer);
    return hex;
}

/**
 * Returns true when the sum of the ArrayBuffer digest of given message is even and false when odd.
 * @param message
 */
export async function isEven(message: string) {
    const arrayBuffer = await digestMessage(message);
    const byteArray = new Uint8Array(arrayBuffer);
    return (
        byteArray.reduce(
            (previousValue: number, currentValue: number) =>
                previousValue + currentValue
        ) %
            2 ===
        0
    );
}
