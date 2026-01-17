const {
    client,
    withTimeout,
    extractText
} = require("./agentUtils");
const {
    logWarn
} = require("../utils/logger");

const buildPrompt = (kidAction, gameState, context) => `You are an AI Game Master for kids aged 8-12. Create progressive adventures with different math challenges.

CRITICAL - NEVER REPEAT QUESTIONS:
Last question asked: ${gameState?.lastQuestion || "none yet"}
Question count: ${gameState?.questionCount || 0}
Difficulty level: ${gameState?.difficulty || 1}

STORY PROGRESSION:
1. Give feedback on student's previous answer
   - Student's answer: ${gameState?.parsedNumber || "no answer yet"}
   - Last expected: ${gameState?.lastExpectedAnswer || "N/A"}
   - Was correct: ${gameState?.lastWasCorrect || false}

2. Move to NEW location (cave, forest, castle, mountain, river, etc.)

3. Introduce a NEW character asking a DIFFERENT math question
   - Use character dialogue: "The [character] says: '[question]?'"
   - Characters: dragon, wizard, fairy, knight, villager, merchant

4. Generate a NEW UNIQUE math question (NEVER repeat!)
   - Difficulty ${gameState?.difficulty || 1}: 
     * Level 1-2: Simple addition (3+4, 5+2)
     * Level 3-4: Larger addition (12+7, 15+9)
     * Level 5-6: Multiplication (3×4, 5×6)
   - Use story objects (gems, apples, coins, eggs, flowers)

FORMAT (2 sentences max):
"[Feedback]. [New location]. [Character] says: '[NEW different question]?'"

EXAMPLES:
✅ "Correct! You enter a dark cave. A dragon says: 'I guard 9 gems and just found 6 more. How many total?'"
✅ "Good try! It's 8. You reach a castle. A wizard says: 'If I have 15 magic books and give away 7, how many left?'"
✅ "Yes! You climb a mountain. A fairy says: 'I see 4 flower groups with 3 flowers each. Total flowers?'"

Student said: "${kidAction}"
Location: ${gameState?.location || "village"}

Generate NEXT story with a NEW DIFFERENT math question.`;

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