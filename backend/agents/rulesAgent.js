const { client, withTimeout, extractText, safeJsonParse } = require("./agentUtils");
const { logWarn } = require("../utils/logger");

const buildPrompt = (kidAction, gameState) => `You are the game master enforcing rules and mechanics.

Current game state:
- HP: ${gameState?.hp ?? 5} / 5
- Magic: ${gameState?.magic ?? 3} / 3
- Inventory: ${JSON.stringify(gameState?.inventory || [])}
- Location: ${gameState?.location || "unknown"}
- Level: ${gameState?.level || 1}

Kid wants to: ${kidAction}

Determine:
1. Is this action possible given current state?
2. What changes to game state?
3. Does this require a skill check?

Output JSON:
{
  "valid": true/false,
  "reason": "Why possible or not",
  "stateChanges": {
    "hp": 4,
    "magic": 2,
    "inventory": ["staff", "potion"],
    "location": "cave"
  },
  "needsChallenge": true/false,
  "challengeType": "math" // if applicable
}`;

const validateAction = async (kidAction, gameState = {}) => {
  const fallback = {
    valid: true,
    reason: "Action accepted.",
    stateChanges: { ...gameState },
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
        messages: [{ role: "user", content: "Validate the action." }]
      }),
      8000
    );

    const text = extractText(response);
    return safeJsonParse(text, fallback);
  } catch (error) {
    logWarn("rules_agent_failed", { message: error.message });
    return fallback;
  }
};

module.exports = {
  validateAction
};
