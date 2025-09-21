import express from "express";
import RewardEvent from "../models/RewardEvent.js";

const router = express.Router();

router.get("/today-stocks/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const start = new Date(); start.setUTCHours(0,0,0,0);
    const now = new Date();

    const rows = await RewardEvent.find({
      userId, rewardedAt: { $gte: start, $lte: now }
    }).sort({ rewardedAt: 1 });

    return res.json({
      userId,
      date: start.toISOString().slice(0,10),
      items: rows.map(r => ({
        rewardId: r._id,
        symbol: r.symbol,
        quantity: r.quantity.toString(),
        rewardedAt: r.rewardedAt.toISOString(),
        campaign: { id: r.campaignId ?? null, reason: r.reason ?? null }
      }))
    });
  } catch (err) {
    console.error("GET /today-stocks error:", err.message);
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;
