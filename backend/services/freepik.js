const axios = require("axios");
const {
    freepik
} = require("../config/apiKeys");
const {
    logWarn
} = require("../utils/logger");

const generateSceneImage = async (prompt) => {
    if (!prompt) return null;
    if (!freepik) {
        logWarn("freepik_missing_key");
        return null;
    }

    try {
        const response = await axios.post(
            "https://api.freepik.com/v1/ai/text-to-image", {
                prompt: prompt,
                negative_prompt: "scary, dark, violent, inappropriate, low quality, blurry, photorealistic",
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

        const imageData = response.data ? .data ? . [0];
        if (imageData ? .base64) {
            return `data:image/jpeg;base64,${imageData.base64}`;
        }
        return response.data ? .data ? . [0] ? .url || response.data ? .url || null;
    } catch (error) {
        logWarn("freepik_image_failed", {
            message: error.message,
            status: error.response ? .status,
            data: error.response ? .data
        });
        return null;
    }
};

const generateSceneVideo = async (prompt, previousImageBase64) => {
    if (!prompt) return null;
    if (!freepik) {
        logWarn("freepik_missing_key");
        return null;
    }

    try {
        const response = await axios.post(
            "https://api.freepik.com/v1/ai/image-to-video/kling-v2-6-pro", {
                prompt: prompt,
                duration: "5",
                negative_prompt: "scary, dark, violent, inappropriate",
                cfg_scale: 0.5,
                aspect_ratio: "widescreen_16_9",
                generate_audio: false
            }, {
                headers: {
                    "x-freepik-api-key": freepik,
                    "Content-Type": "application/json"
                },
                timeout: 30000
            }
        );

        return {
            taskId: response.data ? .data ? .task_id,
            status: response.data ? .data ? .status,
            generated: response.data ? .data ? .generated
        };
    } catch (error) {
        logWarn("freepik_video_failed", {
            message: error.message,
            status: error.response ? .status,
            data: error.response ? .data
        });
        return null;
    }
};

module.exports = {
    generateSceneImage,
    generateSceneVideo
};