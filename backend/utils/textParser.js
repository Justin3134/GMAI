// Extract numbers from unclear student responses

const numberWords = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20
};

const extractNumber = (text) => {
    if (!text) return null;

    const lower = text.toLowerCase();

    // Try to find digits first
    const digitMatch = lower.match(/\d+/);
    if (digitMatch) {
        return parseInt(digitMatch[0], 10);
    }

    // Try to find number words
    for (const [word, num] of Object.entries(numberWords)) {
        if (lower.includes(word)) {
            return num;
        }
    }

    return null;
};

const isUnclearResponse = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return (
        lower.includes('idk') ||
        lower.includes("i don't know") ||
        lower.includes("not sure") ||
        lower.includes('maybe') ||
        lower.includes('i think') ||
        lower.includes('um') ||
        lower.includes('uh')
    );
};

const cleanResponse = (text) => {
    if (!text) return "";

    // Remove filler words
    return text
        .toLowerCase()
        .replace(/\b(um|uh|like|you know|idk|maybe|i think|i don't know|not sure)\b/gi, '')
        .trim();
};

module.exports = {
    extractNumber,
    isUnclearResponse,
    cleanResponse
};