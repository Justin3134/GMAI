const {
    client,
    withTimeout,
    extractText,
    safeJsonParse
} = require("./agentUtils");
const {
    logWarn
} = require("../utils/logger");

const buildPrompt = (kidAction, gameState) => `You are a supportive game master who helps kids progress through adventures.

Current state:
- HP: ${gameState?.hp ?? 5} / 5
- Magic: ${gameState?.magic ?? 3} / 3
- Location: ${gameState?.location || "village"}
- Level: ${gameState?.level || 1}
- Last story: ${gameState?.lastStory || ""}

Student said: "${kidAction}"

Your job:
1. ALWAYS mark action as valid (help them progress!)
2. If it's an answer to a math question, note if correct/wrong
3. Continue the adventure naturally
4. Suggest new location if they're exploring

Output JSON:
{
  "valid": true,
  "reason": "Student's action accepted",
  "stateChanges": {
    "location": "new_location_if_changed"
  },
  "needsChallenge": false,
  "wasAnswer": false,
  "answerCorrect": null
}

ALWAYS set "valid": true - never block the student!`;

const validateAction = async (kidAction, gameState = {}) => {
    const fallback = {
        valid: true,
        reason: "Action accepted.",
        stateChanges: {
            ...gameState
        },
        needsChallenge: false,
        challengeType: null
    };

    try {
        const response = await withTimeout(
            client.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 300,
                temperature: 0.1,
                system: buildPrompt(kidAction, gameState),
                messages: [{
                    role: "user",
                    content: "Validate the action."
                }]
            }),
            8000
        );

        const text = extractText(response);
        return safeJsonParse(text, fallback);
    } catch (error) {
        logWarn("rules_agent_failed", {
            message: error.message
        });
        return fallback;
    }
};

module.exports = {
    validateAction
};