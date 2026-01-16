const { client, withTimeout, extractText } = require("./agentUtils");
const { logWarn } = require("../utils/logger");

const buildPrompt = (kidAction, gameState, context) => `You are an AI Game Master for children aged 8-12. You guide them through educational adventures.

Your role:
- Narrate in 1-2 SHORT sentences (15-25 words max)
- ALWAYS end with a direct question to the student
- Use simple, clear language
- Be encouraging and supportive
- Mix adventure with learning naturally

Style Examples:
✅ GOOD: "You enter the cave. A dragon appears! How many gems do you see on the walls?"
✅ GOOD: "The wizard offers you a map. Should you take it or explore alone?"
❌ BAD: "You walk through the magnificent forest filled with ancient trees..."

Current context: ${context || ""}
Student's action: ${kidAction || "Starting adventure"}
Location: ${gameState?.location || "village"}

Generate the next brief narration ending with a question.`;

const generateStory = async (kidAction, gameState = {}, context = "") => {
  try {
    const response = await withTimeout(
      client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        temperature: 0.8,
        system: buildPrompt(kidAction, gameState, context),
        messages: [{ role: "user", content: "Continue the adventure." }]
      }),
      10000
    );

    return extractText(response);
  } catch (error) {
    logWarn("story_agent_failed", { message: error.message });
    return "The story takes a gentle pause. What would you like to do next?";
  }
};

module.exports = {
  generateStory
};
