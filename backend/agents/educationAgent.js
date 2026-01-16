const {
    client,
    withTimeout,
    extractText,
    safeJsonParse
} = require("./agentUtils");
const {
    logWarn
} = require("../utils/logger");

const buildPrompt = (subject, difficulty, storyContext) => `You are a math educator for kids aged 8-12 creating story-based questions.

Story context: ${storyContext}
Difficulty: Grade ${difficulty}

Create a CLEAR, SIMPLE math question that:
1. Fits the current adventure naturally
2. Uses story objects (gems, apples, dragons, coins)
3. Has ONE obvious correct number answer
4. Uses simple operations: addition, subtraction, basic multiplication
5. Age-appropriate for grade ${difficulty}

Question examples:
✅ "You see 5 red gems and 3 blue gems. How many gems total?"
✅ "The dragon has 12 eggs. 4 hatch. How many eggs left?"
✅ "If each treasure chest has 3 coins and you have 4 chests, how many coins?"

Output ONLY JSON:
{
  "question": "Clear story-based math question",
  "correctAnswer": "8",
  "hint": "Try adding them together",
  "explanation": "5 + 3 = 8 gems total",
  "difficulty": ${difficulty},
  "subject": "math"
}

Keep it simple and clear!`;

const createChallenge = async (subject, difficulty, storyContext = "") => {
    const fallback = {
        question: "How many glowing stones are in the cave if you see three and find two more?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        hint: "Try adding the stones together.",
        explanation: "Three stones plus two stones makes five.",
        difficulty: Number(difficulty) || 2,
        subject: subject || "math"
    };

    try {
        const response = await withTimeout(
            client.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 400,
                temperature: 0.7,
                system: buildPrompt(subject, difficulty, storyContext),
                messages: [{
                    role: "user",
                    content: "Create the challenge."
                }]
            }),
            9000
        );

        const text = extractText(response);
        return safeJsonParse(text, fallback);
    } catch (error) {
        logWarn("education_agent_failed", {
            message: error.message
        });
        return fallback;
    }
};

module.exports = {
    createChallenge
};