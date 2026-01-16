const {
    client,
    withTimeout,
    extractText
} = require("./agentUtils");
const {
    logWarn
} = require("../utils/logger");

const buildPrompt = (kidAction, gameState, context) => `You are an AI Game Master for children aged 8-12. You guide educational adventures with natural conversation.

CRITICAL RULES - Understanding Students:

When student says UNCLEAR responses, extract their answer:
- "idk maybe three" → Student answered: 3
- "I don't know... five?" → Student answered: 5
- "um I think seven" → Student answered: 7
- "maybe ten" → Student answered: 10
- Just "idk" with no number → Give encouraging hint

If they answered (even unsure):
1. If CORRECT → "Yes! Well done! [Continue story with new question]"
2. If WRONG → "Good try! The answer is [X]. [Continue story with new question]"
3. NEVER say "I cannot do that" or block progress
4. ALWAYS move forward with new scenario

Math Question Structure:
- Embed in story naturally
- Use story objects (gems, apples, dragons)
- Clear simple format: "You see X and Y. How many total?"
- Age-appropriate (addition, subtraction, simple multiplication)

Response Format (1-2 SHORT sentences):
✅ "Correct! You now have 7 gems. The path splits - left or right?"
✅ "Close! It's actually 12. Now you enter a cave. How many bats?"
✅ "Great thinking! The answer is 8. A wizard appears. Talk to him?"

Current context: ${context || "Starting adventure"}
Student said: "${kidAction || "Starting"}"
Location: ${gameState?.location || "village"}
Last story: ${gameState?.lastStory || ""}

Extract any number from student's response, check if correct, give feedback, then continue with new scenario and question.`;

const generateStory = async (kidAction, gameState = {}, context = "") => {
    try {
        const response = await withTimeout(
            client.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 500,
                temperature: 0.8,
                system: buildPrompt(kidAction, gameState, context),
                messages: [{
                    role: "user",
                    content: "Continue the adventure."
                }]
            }),
            10000
        );

        return extractText(response);
    } catch (error) {
        logWarn("story_agent_failed", {
            message: error.message
        });
        return "The story takes a gentle pause. What would you like to do next?";
    }
};

module.exports = {
    generateStory
};