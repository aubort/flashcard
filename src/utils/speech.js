
let selectedVoice = null;

export const getFrenchVoices = () => {
    if (!window.speechSynthesis) return [];
    const voices = window.speechSynthesis.getVoices();
    return voices.filter(v => v.lang.includes('fr'));
};

export const setVoice = (voice) => {
    selectedVoice = voice;
};

export const speakWord = (word) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'fr-FR'; // French
    utterance.rate = 0.8; // Slightly slower for kids

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        // Fallback: Try to find a good default French voice if none selected
        const voices = getFrenchVoices();
        // Prioritize "Google" or "Siri" or "Enhanced" voices if possible, otherwise just the first one
        const preferred = voices.find(v =>
            v.name.includes("Google") || v.name.includes("Siri") || v.name.includes("Audrey") || v.name.includes("Thomas")
        );
        if (preferred) {
            utterance.voice = preferred;
        } else if (voices.length > 0) {
            utterance.voice = voices[0];
        }
    }

    window.speechSynthesis.speak(utterance);
};

