const axios = require("axios");
const { modulate } = require("../config/apiKeys");
const { logWarn } = require("../utils/logger");

const analyzeEmotion = async (audioData) => {
  if (!audioData) return null;
  if (!modulate) {
    return {
      emotion: "neutral",
      energy: "medium",
      confidence: 0.4,
      indicators: ["no_api_key"]
    };
  }

  try {
    const response = await axios.post(
      "https://api.modulate.ai/v1/emotion",
      { audio: audioData },
      {
        headers: {
          Authorization: `Bearer ${modulate}`
        },
        timeout: 8000
      }
    );

    return response.data;
  } catch (error) {
    logWarn("modulate_analyze_failed", { message: error.message });
    return null;
  }
};

const getEngagementScore = async (audioData) => {
  const emotionData = await analyzeEmotion(audioData);
  if (!emotionData) return 50;
  const base = emotionData.energy === "high" ? 85 : emotionData.energy === "low" ? 40 : 60;
  return Math.min(100, Math.max(0, Math.round(base * (emotionData.confidence || 0.6))));
};

const recommendAdaptation = (emotionData) => {
  if (!emotionData) return "No signal";
  switch (emotionData.emotion) {
    case "bored":
      return "Kid sounds bored -> inject excitement";
    case "confused":
      return "Kid sounds confused -> slow down and add hints";
    case "scared":
      return "Kid sounds scared -> lighten tone and add humor";
    case "excited":
      return "Kid sounds excited -> keep momentum and celebrate";
    default:
      return "Maintain current pace";
  }
};

module.exports = {
  analyzeEmotion,
  getEngagementScore,
  recommendAdaptation
};
