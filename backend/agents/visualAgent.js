const {
    client,
    withTimeout,
    extractText
} = require("./agentUtils");
const {
    logWarn
} = require("../utils/logger");

const buildPrompt = (storyText, characterClass) => `You are a visual prompt generator for children's storybook illustrations.

Character: ${characterClass} (remember their appearance for consistency)
Current story: ${storyText}

Generate a detailed image prompt for Freepik API that:
- Describes the scene from the story
- Keeps character appearance CONSISTENT (same ${characterClass} appearance)
- Uses vibrant, magical, kid-friendly style
- Includes key story elements
- Is 30-50 words

Output ONLY the prompt text, no JSON, no extra formatting.

Example output: "A brave young wizard with purple robes and sparkly hat stands in a magical forest clearing, talking to a friendly glowing fairy, surrounded by colorful flowers, children's storybook digital art style, vibrant colors, magical atmosphere"`;

const generateImagePrompt = async (storyText, characterClass = "wizard") => {
    try {
        const response = await withTimeout(
            client.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 150,
                temperature: 0.6,
                system: buildPrompt(storyText, characterClass),
                messages: [{
                    role: "user",
                    content: "Generate the image prompt."
                }]
            }),
            6000
        );

        return extractText(response);
    } catch (error) {
        logWarn("visual_agent_failed", {
            message: error.message
        });
        return `A ${characterClass} character in a magical adventure scene, children's storybook illustration, vibrant colors`;
    }
};

module.exports = {
    generateImagePrompt
};