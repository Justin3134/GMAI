const Anthropic = require("@anthropic-ai/sdk");
const { anthropic } = require("../config/apiKeys");
const { logWarn } = require("../utils/logger");

const AnthropicClient = Anthropic.default || Anthropic;
const client = new AnthropicClient({ apiKey: anthropic });

const withTimeout = async (promise, timeoutMs) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const extractText = (message) => {
  if (!message?.content) return "";
  return message.content
    .map((item) => (typeof item.text === "string" ? item.text : ""))
    .join("")
    .trim();
};

const safeJsonParse = (text, fallback) => {
  if (!text) return fallback;
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    logWarn("agent_json_parse_failed", { message: error.message });
    return fallback;
  }
};

module.exports = {
  client,
  withTimeout,
  extractText,
  safeJsonParse
};
