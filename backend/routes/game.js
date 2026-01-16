const express = require("express");
const {
    randomUUID
} = require("crypto");
const {
    generateStory
} = require("../agents/storyAgent");
const {
    createChallenge
} = require("../agents/educationAgent");
const {
    textToSpeech
} = require("../services/elevenlabs");
const {
    processKidAction
} = require("../orchestrator");

const router = express.Router();
const games = new Map();

const requireFields = (fields, body) => {
    const missing = fields.filter((field) => body[field] === undefined || body[field] === null);
    return missing.length ? missing : null;
};

router.post("/api/game/start", async (req, res, next) => {
    try {
        const missing = requireFields(["kidName", "characterClass", "kidId"], req.body || {});
        if (missing) {
            return res.status(400).json({
                error: `Missing fields: ${missing.join(", ")}`
            });
        }

        const {
            kidName,
            characterClass,
            kidId
        } = req.body;
        const gameId = `game_${randomUUID()}`;
        const gameState = {
            hp: 5,
            magic: 3,
            level: 1,
            inventory: [],
            location: "village",
            character: {
                name: kidName,
                class: characterClass
            },
            storyBeat: 0,
            lastStory: "",
            context: "A bright, friendly village filled with magical curiosity."
        };

        const welcomeNarration = await generateStory(
            `Start the adventure for ${kidName} the ${characterClass}.`,
            gameState,
            gameState.context
        );

        // Determine voice based on character class
        const voiceMap = {
            wizard: "wizard",
            knight: "knight",
            rogue: "narrator"
        };
        const voiceType = voiceMap[characterClass] || "narrator";

        const audioUrl = await textToSpeech(welcomeNarration, voiceType);

        games.set(gameId, gameState);

        res.json({
            gameId,
            gameState,
            welcomeNarration,
            audioUrl
        });
    } catch (error) {
        next(error);
    }
});

router.post("/api/game/action", async (req, res, next) => {
    try {
        const missing = requireFields(["gameId", "kidAction", "gameState", "kidId"], req.body || {});
        if (missing) {
            return res.status(400).json({
                error: `Missing fields: ${missing.join(", ")}`
            });
        }

        const {
            gameId,
            kidAction,
            gameState,
            kidId
        } = req.body;
        const response = await processKidAction(kidAction, gameState, kidId);
        games.set(gameId, response.gameState || gameState);

        res.json(response);
    } catch (error) {
        next(error);
    }
});

router.get("/api/game/state/:gameId", (req, res) => {
    const gameState = games.get(req.params.gameId);
    if (!gameState) {
        return res.status(404).json({
            error: "Game not found"
        });
    }
    res.json(gameState);
});

router.post("/api/education/challenge", async (req, res, next) => {
    try {
        const missing = requireFields(["subject", "difficulty", "storyContext"], req.body || {});
        if (missing) {
            return res.status(400).json({
                error: `Missing fields: ${missing.join(", ")}`
            });
        }

        const {
            subject,
            difficulty,
            storyContext
        } = req.body;
        const challenge = await createChallenge(subject, difficulty, storyContext);
        res.json(challenge);
    } catch (error) {
        next(error);
    }
});

module.exports = router;