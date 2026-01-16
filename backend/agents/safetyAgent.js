const { client, withTimeout, extractText, safeJsonParse } = require("./agentUtils");
const { logWarn } = require("../utils/logger");

const buildPrompt = (storyProposal, context) => `You are a content safety filter for children's educational content (ages 8-12).

Review the proposed story content and check for:
❌ Violence or fighting
❌ Scary/frightening imagery
❌ Inappropriate language
❌ Themes too mature
❌ Characters in danger

If content is unsafe:
- Flag the specific issue
- Provide a kid-friendly alternative

Output JSON:
{
  "safe": true/false,
  "issues": ["violence", "scary"],
  "alternative": "Rewritten safe version",
  "confidence": 0.95
}

Proposed content: ${storyProposal}
Context: ${context || ""}`;

const reviewContent = async (storyProposal, context = "") => {
  const fallback = {
    safe: true,
    issues: [],
    alternative: storyProposal,
    confidence: 0.5
  };

  try {
    const response = await withTimeout(
      client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        temperature: 0.2,
        system: buildPrompt(storyProposal, context),
        messages: [{ role: "user", content: "Review the content." }]
      }),
      8000
    );

    const text = extractText(response);
    return safeJsonParse(text, fallback);
  } catch (error) {
    logWarn("safety_agent_failed", { message: error.message });
    return fallback;
  }
};

module.exports = {
  reviewContent
};
