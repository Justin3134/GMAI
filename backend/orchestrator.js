const {
    generateStory
} = require("./agents/storyAgent");
const {
    reviewContent
} = require("./agents/safetyAgent");
const {
    validateAction
} = require("./agents/rulesAgent");
const {
    createChallenge
} = require("./agents/educationAgent");
const {
    npcRespond
} = require("./agents/npcAgent");
const {
    generateImagePrompt
} = require("./agents/visualAgent");
const {
    textToSpeech
} = require("./services/elevenlabs");
const {
    generateSceneImage,
    generateSceneVideo
} = require("./services/freepik");
const {
    analyzeEmotion,
    getEngagementScore
} = require("./services/modulate");
const {
    storeNPCMemory,
    getContext
} = require("./services/senso");
const {
    logAgentMetric,
    logEngagement,
    logEducationMetric
} = require("./services/macroscope");
const {
    logWarn
} = require("./utils/logger");

const NPC_KEYWORDS = ["dragon", "fairy", "wizard", "knight"];

const detectNpc = (text) => {
    if (!text) return null;
    const lower = text.toLowerCase();
    return NPC_KEYWORDS.find((npc) => lower.includes(npc)) || null;
};

const getVoiceTypeForCharacter = (characterClass) => {
    const voiceMap = {
        wizard: "wizard",
        knight: "knight",
        rogue: "narrator"
    };
    return voiceMap[characterClass] || "narrator";
};

const processKidAction = async (kidAction, gameState = {}, kidId) => {
    const start = Date.now();
    const decisions = {};

    try {
        const [storyResult, safetyResult, rulesResult] = await Promise.all([
            (async () => {
                const t0 = Date.now();
                const text = await generateStory(kidAction, gameState, gameState.context || "");
                decisions.story = {
                    text,
                    time: (Date.now() - t0) / 1000
                };
                await logAgentMetric("StoryAgent", {
                    latency: Date.now() - t0,
                    success: Boolean(text)
                });
                return text;
            })(),
            (async () => {
                const t0 = Date.now();
                const review = await reviewContent(gameState.lastStory || "", gameState.context || "");
                decisions.safety = {
                    safe: review.safe,
                    time: (Date.now() - t0) / 1000
                };
                await logAgentMetric("SafetyAgent", {
                    latency: Date.now() - t0,
                    success: review.safe
                });
                return review;
            })(),
            (async () => {
                const t0 = Date.now();
                const rules = await validateAction(kidAction, gameState);
                decisions.rules = {
                    valid: rules.valid,
                    time: (Date.now() - t0) / 1000,
                    changes: rules.stateChanges
                };
                await logAgentMetric("RulesAgent", {
                    latency: Date.now() - t0,
                    success: rules.valid
                });
                return rules;
            })()
        ]);

        let narration = storyResult;
        if (!safetyResult.safe) {
            narration = safetyResult.alternative || "Let's try a gentler path in the story.";
        }

        if (!rulesResult.valid) {
            narration = `That action isn't possible right now. ${rulesResult.reason} What would you like to try instead?`;
        }

        const updatedState = {
            ...gameState,
            ...(rulesResult.stateChanges || {}),
            lastStory: narration,
            storyBeat: (gameState.storyBeat || 0) + 1
        };

        let challenge = null;
        if (rulesResult.needsChallenge || updatedState.storyBeat % 3 === 0) {
            challenge = await createChallenge(
                rulesResult.challengeType || "math",
                updatedState.level || 1,
                narration
            );
            await logEducationMetric(kidId, {
                subject: challenge.subject,
                difficulty: challenge.difficulty,
                generated: true
            });
        }

        const npcName = detectNpc(narration);
        let npcResponse = null;
        if (npcName) {
            const memory = await getContext(kidId, `npc:${npcName}`);
            npcResponse = await npcRespond(npcName, kidAction, JSON.stringify(memory));
            await storeNPCMemory(kidId, npcName, {
                date: new Date().toISOString(),
                context: narration,
                relationship: "friendly",
                kidQuestion: kidAction
            });
        }

        if (npcResponse) {
            narration = `${narration}\n\n${npcResponse}`;
        }

        const emotionData = gameState.audioData ? await analyzeEmotion(gameState.audioData) : null;
        const engagementScore = emotionData ? await getEngagementScore(gameState.audioData) : null;
        if (engagementScore !== null) {
            await logEngagement(kidId, {
                engagementScore,
                emotion: emotionData ? .emotion
            });
        }

        // Determine voice based on character class
        const characterClass = updatedState.character ? .class || gameState.character ? .class;
        const voiceType = getVoiceTypeForCharacter(characterClass);

        // Generate specialized image prompt via Visual Agent
        const imagePrompt = await generateImagePrompt(narration, characterClass);
        console.log('🎨 Generated image prompt:', imagePrompt);

        // Generate audio and image in parallel
        const [audioUrl, imageUrl] = await Promise.all([
            textToSpeech(narration, voiceType),
            generateSceneImage(imagePrompt)
        ]);

        console.log('✅ Assets generated:', {
            hasAudio: !!audioUrl,
            hasImage: !!imageUrl
        });

        return {
            narration,
            audioUrl,
            imageUrl,
            gameState: updatedState,
            agentDecisions: decisions,
            challenge
        };
    } catch (error) {
        logWarn("orchestrator_failed", {
            message: error.message
        });
        return {
            narration: "Our adventure is taking a tiny pause. What would you like to do next?",
            audioUrl: null,
            imageUrl: null,
            gameState,
            agentDecisions: decisions,
            challenge: null
        };
    } finally {
        decisions.totalTime = (Date.now() - start) / 1000;
    }
};

module.exports = {
    processKidAction
};