
// List of sounds to highlight, ordered by length (longest first) to avoid partial matches
const SPECIAL_SOUNDS = [
    // Trigraphs
    "eau", "oeu", "oin", "ien",
    // Digraphs
    "ou", "oi", "ai", "ei", "au", "eu", "ui", "an", "en", "in", "on", "un", "om", "em", "im"
];

export const parseWord = (word) => {
    if (!word) return [];

    // Create a regex that matches any of the special sounds
    // Case insensitive
    const pattern = new RegExp(`(${SPECIAL_SOUNDS.join('|')})`, 'gi');

    // Split the word by the pattern, but keep the delimiters (the sounds)
    // filter(Boolean) removes empty strings if the word starts/ends with a match
    const parts = word.split(pattern).filter(part => part !== "");

    return parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        const isSpecial = SPECIAL_SOUNDS.includes(lowerPart);
        return {
            text: part,
            isSpecial: isSpecial,
            id: index
        };
    });
};
