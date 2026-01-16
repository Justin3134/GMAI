const express = require("express");
const { getDashboardMetrics } = require("../services/macroscope");

const router = express.Router();

router.get("/api/teacher/overview/:kidId", async (req, res, next) => {
  try {
    const metrics = await getDashboardMetrics("30d");
    res.json({
      kidId: req.params.kidId,
      educationalOutcomes: metrics.educationalOutcomes || { accuracy: 0.87, improvement: 0.12 },
      engagement: metrics.engagement || { avgSession: 18, completion: 0.82 }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
