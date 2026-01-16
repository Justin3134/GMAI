const axios = require("axios");
const { senso } = require("../config/apiKeys");
const { logWarn } = require("../utils/logger");

const inMemory = {
  profiles: new Map(),
  npcMemory: new Map(),
  patterns: []
};

const getNpcKey = (kidId, npcName) => `${kidId}::${npcName}`;

const storeKidProfile = async (kidId, data) => {
  if (!kidId || !data) return null;
  inMemory.profiles.set(kidId, data);
  if (!senso) return data;

  try {
    await axios.post(
      "https://api.senso.ai/v1/kids",
      { kidId, data },
      {
        headers: {
          Authorization: `Bearer ${senso}`
        },
        timeout: 12000
      }
    );
  } catch (error) {
    logWarn("senso_profile_failed", { message: error.message });
  }

  return data;
};

const storeNPCMemory = async (kidId, npcName, interaction) => {
  if (!kidId || !npcName || !interaction) return null;
  const key = getNpcKey(kidId, npcName);
  const existing = inMemory.npcMemory.get(key) || [];
  existing.push(interaction);
  inMemory.npcMemory.set(key, existing);

  if (!senso) return interaction;

  try {
    await axios.post(
      "https://api.senso.ai/v1/npc-memory",
      { kidId, npcName, interaction },
      {
        headers: {
          Authorization: `Bearer ${senso}`
        },
        timeout: 12000
      }
    );
  } catch (error) {
    logWarn("senso_npc_failed", { message: error.message });
  }

  return interaction;
};

const storePattern = async (patternData) => {
  if (!patternData) return null;
  inMemory.patterns.push(patternData);

  if (!senso) return patternData;

  try {
    await axios.post(
      "https://api.senso.ai/v1/patterns",
      { patternData },
      {
        headers: {
          Authorization: `Bearer ${senso}`
        },
        timeout: 12000
      }
    );
  } catch (error) {
    logWarn("senso_pattern_failed", { message: error.message });
  }

  return patternData;
};

const getContext = async (kidId, query) => {
  if (!kidId || !query) return [];

  if (!senso) {
    const profile = inMemory.profiles.get(kidId);
    const npcItems = Array.from(inMemory.npcMemory.entries())
      .filter(([key]) => key.startsWith(`${kidId}::`))
      .flatMap(([, interactions]) => interactions);

    const matching = [profile, ...npcItems, ...inMemory.patterns].filter(Boolean);
    return matching.slice(0, 5);
  }

  try {
    const response = await axios.post(
      "https://api.senso.ai/v1/search",
      { kidId, query },
      {
        headers: {
          Authorization: `Bearer ${senso}`
        },
        timeout: 12000
      }
    );

    return response.data?.results || [];
  } catch (error) {
    logWarn("senso_search_failed", { message: error.message });
    return [];
  }
};

module.exports = {
  storeKidProfile,
  storeNPCMemory,
  storePattern,
  getContext
};
