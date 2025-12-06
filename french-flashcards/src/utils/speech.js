export const speakWord = (word) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'fr-FR'; // French
    utterance.rate = 0.8; // Slightly slower for kids

    // Try to find a French voice
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find(v => v.lang.includes('fr'));
    if (frenchVoice) {
        utterance.voice = frenchVoice;
    }

    window.speechSynthesis.speak(utterance);
};
