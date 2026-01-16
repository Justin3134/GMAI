const axios = require("axios");
const { freepik } = require("../config/apiKeys");
const { logWarn } = require("../utils/logger");

const enhancePromptForScene = (storyText) => {
    const basePrompt = "Children's storybook illustration, vibrant colors, magical fantasy scene, high quality, detailed digital art";
    const scenePrompt = `${basePrompt}, ${storyText.substring(0, 200)}`;
    return scenePrompt;
};

const generateSceneImage = async (prompt) => {
    if (!prompt) return null;
    if (!freepik) {
        logWarn("freepik_missing_key");
        return null;
    }

    try {
        const enhancedPrompt = enhancePromptForScene(prompt);

        const response = await axios.post(
            "https://api.freepik.com/v1/ai/text-to-image", {
                prompt: enhancedPrompt,
                negative_prompt: "scary, dark, violent, inappropriate, low quality, blurry",
                num_images: 1,
                image: {
                    size: "landscape_16_9"
                },
                styling: {
                    style: "digital-art",
                    color: "vibrant",
                    lightning: "warm"
                }
            }, {
                headers: {
                    "x-freepik-api-key": freepik,
                    "Content-Type": "application/json"
                },
                timeout: 15000
            }
        );

        const imageData = response.data?.data?.[0];
        if (imageData?.base64) {
            return `data:image/jpeg;base64,${imageData.base64}`;
        }
        return response.data?.data?.[0]?.url || response.data?.url || null;
    } catch (error) {
        logWarn("freepik_image_failed", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        return null;
    }
};

module.exports = {
    generateSceneImage
};
