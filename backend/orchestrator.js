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
    textToSpeech,
    textToSpeechDynamic
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
const {
    extractNumber,
    isUnclearResponse,
    cleanResponse
} = require("./utils/textParser");

const NPC_KEYWORDS = ["dragon", "fairy", "wizard", "knight"];

// Store recent questions for answer validation
const conversationMemory = new Map(); // kidId -> { lastQuestion, lastAnswer, questionCount }

const detectNpc = (text) => {
    if (!text) return null;
    const lower = text.toLowerCase();
    return NPC_KEYWORDS.find((npc) => lower.includes(npc)) || null;
};

const saveQuestion = (kidId, question, extractedNumber) => {
    const memory = conversationMemory.get(kidId) || {
        questions: [],
        questionCount: 0
    };
    memory.lastQuestion = question;
    memory.lastExpectedAnswer = extractedNumber;
    memory.questionCount = (memory.questionCount || 0) + 1;
    conversationMemory.set(kidId, memory);
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
        // Get conversation memory for this student
        const memory = conversationMemory.get(kidId) || {
            questions: [],
            questionCount: 0
        };

        // Parse student response for better understanding
        const extractedNumber = extractNumber(kidAction);
        const isUnclear = isUnclearResponse(kidAction);
        const cleanedAction = cleanResponse(kidAction);

        // Add parsing info and memory to game state for agents to use
        const enhancedGameState = {
            ...gameState,
            parsedNumber: extractedNumber,
            isUnclearResponse: isUnclear,
            cleanedAction: cleanedAction || kidAction,
            lastQuestion: memory.lastQuestion,
            lastExpectedAnswer: memory.lastExpectedAnswer,
            questionCount: memory.questionCount,
            conversationHistory: memory.questions || []
        };

        console.log('📝 Parsed student input:', {
            original: kidAction,
            number: extractedNumber,
            unclear: isUnclear,
            cleaned: cleanedAction,
            lastQuestion: memory.lastQuestion,
            expectedAnswer: memory.lastExpectedAnswer
        });

        const [storyResult, safetyResult, rulesResult] = await Promise.all([
            (async () => {
                const t0 = Date.now();
                const text = await generateStory(kidAction, enhancedGameState, enhancedGameState.context || "");
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
                const review = await reviewContent(enhancedGameState.lastStory || "", enhancedGameState.context || "");
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
                const rules = await validateAction(kidAction, enhancedGameState);
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

        // Extract any new question from the narration for next turn
        const questionMatch = narration.match(/(\d+)\s*[\+\-\×\*]\s*(\d+)|how many|what is|total/i);
        if (questionMatch) {
            // Try to extract the expected answer from the question
            const nums = narration.match(/(\d+)/g);
            if (nums && nums.length >= 2) {
                const expectedAnswer = parseInt(nums[0]) + parseInt(nums[1]); // Simple assumption
                saveQuestion(kidId, narration, expectedAnswer);
            }
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

        // Generate specialized visual prompt via Visual Agent
        const visualPrompt = await generateImagePrompt(narration, characterClass);
        console.log('🎨 Generated visual prompt:', visualPrompt);

        // Generate audio with dynamic character voices and image
        const [audioUrl, mediaUrl] = await Promise.all([
            textToSpeechDynamic(narration), // Detects character and uses appropriate voice
            generateSceneVideo(visualPrompt, characterClass, narration)
        ]);

        console.log('✅ Assets generated:', {
            hasAudio: !!audioUrl,
            hasMedia: !!mediaUrl
        });

        return {
            narration,
            audioUrl,
            imageUrl: mediaUrl, // Video or image fallback
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