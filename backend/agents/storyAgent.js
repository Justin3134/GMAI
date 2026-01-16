const { client, withTimeout, extractText } = require("./agentUtils");
const { logWarn } = require("../utils/logger");

const buildPrompt = (kidAction, gameState, context) => `You are a creative storyteller for children aged 8-12. Your ONLY job is to write engaging, age-appropriate adventure narratives.

Rules:
- Write 2-4 sentences per response
- Use vivid, descriptive language kids understand
- End with a question or choice for the kid
- Magic and wonder, never scary or violent
- Encourage curiosity and exploration

You do NOT:
- Handle game mechanics (another agent does this)
- Filter content (another agent does this)
- Create educational challenges (another agent does this)

Current adventure context: ${context || ""}
Kid's last action: ${kidAction || ""}
Location: ${gameState?.location || "unknown"}

Generate the next part of the story.`;

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
