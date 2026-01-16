const axios = require("axios");
const { macroscope } = require("../config/apiKeys");
const { logWarn } = require("../utils/logger");

const batchQueue = [];
let flushing = false;

const flushBatch = async () => {
  if (flushing || !batchQueue.length) return;
  if (!macroscope) {
    batchQueue.length = 0;
    return;
  }

  flushing = true;
  const batch = batchQueue.splice(0, batchQueue.length);
  try {
    await axios.post(
      "https://api.macroscope.ai/v1/metrics",
      { batch },
      {
        headers: {
          Authorization: `Bearer ${macroscope}`
        },
        timeout: 8000
      }
    );
  } catch (error) {
    logWarn("macroscope_batch_failed", { message: error.message });
  } finally {
    flushing = false;
  }
};

setInterval(() => {
  flushBatch();
}, 5000).unref();

const enqueue = (type, payload) => {
  batchQueue.push({ type, payload, timestamp: new Date().toISOString() });
};

const logAgentMetric = async (agentName, metric) => {
  enqueue("agent", { agentName, ...metric });
};

const logEducationMetric = async (kidId, data) => {
  enqueue("education", { kidId, ...data });
};

const logEngagement = async (kidId, sessionData) => {
  enqueue("engagement", { kidId, ...sessionData });
};

const logImprovement = async (metric) => {
  enqueue("improvement", metric);
};

const getDashboardMetrics = async (timeRange) => {
  if (!macroscope) {
    return {
      agentPerformance: { StoryAgent: 1.2, SafetyAgent: 0.6 },
      educationalOutcomes: { accuracy: 0.87, improvement: 0.12 },
      engagement: { avgSession: 18, completion: 0.82 },
      timeRange
    };
  }

  try {
    const response = await axios.get("https://api.macroscope.ai/v1/dashboard", {
      params: { timeRange },
      headers: {
        Authorization: `Bearer ${macroscope}`
      },
      timeout: 8000
    });
    return response.data;
  } catch (error) {
    logWarn("macroscope_dashboard_failed", { message: error.message });
    return {
      agentPerformance: {},
      educationalOutcomes: {},
      engagement: {},
      timeRange
    };
  }
};

module.exports = {
  logAgentMetric,
  logEducationMetric,
  logEngagement,
  logImprovement,
  getDashboardMetrics
};
