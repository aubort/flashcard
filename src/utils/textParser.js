
// List of sounds to highlight, ordered by length (longest first) to avoid partial matches
const SPECIAL_SOUNDS = [
    // Trigraphs
    "eau", "oeu", "oin", "ien",
    // Digraphs
    "ou", "oi", "ai", "ei", "au", "eu", "ui", "an", "en", "in", "on", "un", "om", "em", "im"
];

const EXCEPTIONS = [
    "omm", "enn", "onn", "amm", "emm", "imm"
];

export const parseWord = (word) => {
    if (!word) return [];

    // Combine EXCEPTIONS and SPECIAL_SOUNDS in the regex
    // ORDER MATTERS: Longer patterns must come first.
    // We sort combined list by length descending to ensure 'omm' is matched before 'om'.
    const uniquePatterns = Array.from(new Set([...EXCEPTIONS, ...SPECIAL_SOUNDS]));
    const sortedPatterns = uniquePatterns.sort((a, b) => b.length - a.length);

    // Create a regex that matches any of the patterns
    const pattern = new RegExp(`(${sortedPatterns.join('|')})`, 'gi');

    // Split the word by the pattern
    const parts = word.split(pattern).filter(part => part !== "");

    return parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        // It is special ONLY if it is in SPECIAL_SOUNDS and NOT in EXCEPTIONS
        // (Actually, if it matched 'omm', it's in EXCEPTIONS. If it matched 'om', it's in SPECIAL_SOUNDS)
        // Since we split by exactly what matched, we just check if the matched part is a special sound.
        // If 'omm' matched, it is NOT in SPECIAL_SOUNDS, so isSpecial = false. Correct.
        const isSpecial = SPECIAL_SOUNDS.includes(lowerPart);

        return {
            text: part,
            isSpecial: isSpecial,
            id: index
        };
    });
};
