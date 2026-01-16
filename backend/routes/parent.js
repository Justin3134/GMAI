const express = require("express");
const { getContext } = require("../services/senso");
const { getDashboardMetrics } = require("../services/macroscope");

const router = express.Router();

router.get("/api/parent/progress/:kidId", async (req, res, next) => {
  try {
    const { kidId } = req.params;
    const context = await getContext(kidId, "progress summary");
    const metrics = await getDashboardMetrics("30d");

    res.json({
      stats: { math: 85, vocabulary: 70, reading: 95 },
      recentAchievements: context.slice(0, 3),
      safetyLog: { blockedContent: 0, reasons: [] },
      engagement: metrics.engagement || { avgSession: 18, completion: 0.82 }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
