const axios = require("axios");
const { tonic } = require("../config/apiKeys");
const { logWarn } = require("../utils/logger");

const anonymizeProfile = async (kidData) => {
  if (!kidData) return null;
  if (!tonic) {
    return {
      ...kidData,
      name: `Kid_${Math.floor(Math.random() * 9000) + 1000}`,
      school: kidData.school ? "School_A" : undefined
    };
  }

  try {
    const response = await axios.post(
      "https://api.tonic.ai/v1/anonymize",
      { kidData },
      {
        headers: {
          Authorization: `Bearer ${tonic}`
        },
        timeout: 8000
      }
    );
    return response.data;
  } catch (error) {
    logWarn("tonic_anonymize_failed", { message: error.message });
    return kidData;
  }
};

const maskLogs = async (logData) => {
  if (!logData) return null;
  if (!tonic) {
    const sanitized = JSON.parse(JSON.stringify(logData));
    if (sanitized.name) sanitized.name = "Kid_XXXX";
    if (sanitized.school) sanitized.school = "School_X";
    return sanitized;
  }

  try {
    const response = await axios.post(
      "https://api.tonic.ai/v1/mask",
      { logData },
      {
        headers: {
          Authorization: `Bearer ${tonic}`
        },
        timeout: 8000
      }
    );
    return response.data;
  } catch (error) {
    logWarn("tonic_mask_failed", { message: error.message });
    return logData;
  }
};

const generateDemoData = async () => {
  if (!tonic) {
    return {
      name: "Kid_4829",
      age: 9,
      school: "School_A",
      adventureHistory: ["Met Sparkle", "Solved dragon egg puzzle"],
      preferences: ["dragons", "fairies"]
    };
  }

  try {
    const response = await axios.post(
      "https://api.tonic.ai/v1/demo-data",
      {},
      {
        headers: {
          Authorization: `Bearer ${tonic}`
        },
        timeout: 8000
      }
    );
    return response.data;
  } catch (error) {
    logWarn("tonic_demo_failed", { message: error.message });
    return null;
  }
};

module.exports = {
  anonymizeProfile,
  maskLogs,
  generateDemoData
};
