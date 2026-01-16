const axios = require("axios");
const { elevenlabs } = require("../config/apiKeys");
const { logWarn, logError } = require("../utils/logger");

const VOICE_IDS = {
  narrator: "21m00Tcm4TlvDq8ikWAM", // Rachel
  dragon: "pNInz6obpgDQGcFmaJgB", // Adam
  fairy: "EXAVITQu4vr4xnSDxMaL", // Bella
  wizard: "ErXwobaYiN019PkySvjV", // Antoni
  knight: "TxGEqnHWrfWFTfGW9XjX" // Josh
};

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const audioCache = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCacheKey = (text, voiceType) => `${voiceType}::${text}`;

const getCachedAudio = (text, voiceType) => {
  const key = getCacheKey(text, voiceType);
  const cached = audioCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    audioCache.delete(key);
    return null;
  }
  return cached.audio;
};

const setCachedAudio = (text, voiceType, audio) => {
  audioCache.set(getCacheKey(text, voiceType), {
    audio,
    timestamp: Date.now()
  });
};

const textToSpeech = async (text, voiceType = "narrator") => {
  if (!text) return null;
  if (!elevenlabs) {
    logWarn("elevenlabs_missing_key");
    return null;
  }

  const voiceId = VOICE_IDS[voiceType] || VOICE_IDS.narrator;
  const cached = getCachedAudio(text, voiceType);
  if (cached) return cached;

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  const payload = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.45,
      similarity_boost: 0.75
    }
  };

  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "xi-api-key": elevenlabs,
          "Content-Type": "application/json",
          Accept: "audio/mpeg"
        },
        responseType: "arraybuffer",
        timeout: 12000
      });

      const audioBase64 = Buffer.from(response.data, "binary").toString("base64");
      const audio = `data:audio/mpeg;base64,${audioBase64}`;
      setCachedAudio(text, voiceType, audio);
      return audio;
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      if (status === 429) {
        const retryAfter = Number(error.response?.headers?.["retry-after"]) || 1;
        logWarn("elevenlabs_rate_limited", { attempt, retryAfter });
        await sleep(retryAfter * 1000);
        continue;
      }

      logWarn("elevenlabs_tts_failed", { attempt, status });
      await sleep(200 * attempt);
    }
  }

  logError("elevenlabs_tts_error", { message: lastError?.message });
  return null;
};

const speechToText = async (audioBlob) => {
  if (!audioBlob) return null;
  if (!elevenlabs) {
    logWarn("elevenlabs_missing_key");
    return null;
  }

  // Placeholder: ElevenLabs STT endpoints may vary; keep as backup path.
  try {
    const response = await axios.post("https://api.elevenlabs.io/v1/speech-to-text", audioBlob, {
      headers: {
        "xi-api-key": elevenlabs,
        "Content-Type": "audio/mpeg"
      },
      timeout: 12000
    });
    return response.data?.text || null;
  } catch (error) {
    logWarn("elevenlabs_stt_failed", { message: error.message });
    return null;
  }
};

module.exports = {
  textToSpeech,
  speechToText
};
