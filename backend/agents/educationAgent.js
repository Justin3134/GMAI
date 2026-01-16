const { client, withTimeout, extractText, safeJsonParse } = require("./agentUtils");
const { logWarn } = require("../utils/logger");

const buildPrompt = (subject, difficulty, storyContext) => `You are an educational content creator for kids aged 8-12.

Create learning challenges that feel like adventure puzzles, NOT homework.

Subject options: math, vocabulary, reading, science
Difficulty: grade 1-6
Story context: ${storyContext}

Generate a challenge that:
- Fits naturally into the current adventure
- Uses story elements (e.g., 'How many dragon eggs?' not 'What is 3+4?')
- Has one clear correct answer
- Includes a helpful hint if kid struggles
- Celebrates success

Output JSON:
{
  "question": "Story-based question",
  "options": ["A", "B", "C", "D"], // for multiple choice
  "correctAnswer": "C",
  "hint": "Think about...",
  "explanation": "Here's why...",
  "difficulty": 3,
  "subject": "math"
}

Subject: ${subject}
Difficulty: Grade ${difficulty}
Story: ${storyContext}`;

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
        messages: [{ role: "user", content: "Create the challenge." }]
      }),
      9000
    );

    const text = extractText(response);
    return safeJsonParse(text, fallback);
  } catch (error) {
    logWarn("education_agent_failed", { message: error.message });
    return fallback;
  }
};

module.exports = {
  createChallenge
};
