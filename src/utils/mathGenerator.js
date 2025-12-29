
export const generateProblem = (level = 1, exclude = []) => {
    let max = 10;
    let allowSubtraction = false;

    if (level === 2) {
        max = 12;
        allowSubtraction = false;
    } else if (level === 3) {
        max = 8;
        allowSubtraction = true;
    } else if (level >= 4) {
        max = 20;
        allowSubtraction = true;
    }

    let a, b, result, operator, question;
    let attempts = 0;

    // Try to find a unique question within 50 attempts to avoid infinite loops
    do {
        const isAddition = allowSubtraction ? Math.random() > 0.5 : true;

        if (isAddition) {
            a = Math.floor(Math.random() * (max - 1)) + 1;
            b = Math.floor(Math.random() * (max - 1)) + 1;
            result = a + b;
            operator = "+";
        } else {
            a = Math.floor(Math.random() * (max - 1)) + 1;
            b = Math.floor(Math.random() * a);
            result = a - b;
            operator = "-";
        }
        question = `${a} ${operator} ${b}`;
        attempts++;
    } while (exclude.includes(question) && attempts < 50);

    // Update max for options to be at least the result + some breathing room
    const optionsMax = Math.max(max, result + 5);
    const options = generateOptions(result, optionsMax);

    return {
        question: `${question} = ?`,
        id: question, // Unique ID for tracking
        answer: result,
        options: options
    };
};

const generateOptions = (correctAnswer, max) => {
    const options = new Set();
    options.add(correctAnswer);

    while (options.size < 4) {
        let distractor;
        const offset = Math.floor(Math.random() * 5) + 1;
        if (Math.random() > 0.5) {
            distractor = correctAnswer + offset;
        } else {
            distractor = Math.max(0, correctAnswer - offset);
        }

        if (distractor >= 0) {
            options.add(distractor);
        }
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
};
