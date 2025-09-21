import express from "express";
import { randomUUID } from "crypto";
import RewardEvent from "../models/RewardEvent.js";
import Holding from "../models/Holding.js";

const router = express.Router();

router.post("/reward", async (req, res) => {
  try {
    const { userId, symbol, quantity, rewardedAt, metadata } = req.body || {};
    const idem = req.header("Idempotency-Key");

    if (!userId || !symbol || !quantity || !rewardedAt) {
      return res.status(400).json({ error: "missing_fields" });
    }
    if (!idem) {
      return res.status(400).json({ error: "missing_idempotency_key" });
    }

    const existing = await RewardEvent.findOne({ idempotencyKey: idem });
    if (existing) {
      return res.status(200).json({ rewardId: existing._id, status: "duplicate_ignored" });
    }

    const rewardId = `rew_${randomUUID().slice(0, 8)}`;
    const doc = await RewardEvent.create({
      _id: rewardId,
      userId,
      symbol: symbol.toUpperCase(),
      quantity,
      rewardedAt: new Date(rewardedAt),
      campaignId: metadata?.campaignId,
      reason: metadata?.reason,
      idempotencyKey: idem,
    });

    await Holding.updateOne(
      { userId, symbol: symbol.toUpperCase() },
      { $inc: { quantity }, $set: { asOf: new Date() } },
      { upsert: true }
    );

    return res.status(201).json({
      rewardId,
      status: "recorded",
      symbol: symbol.toUpperCase(),
      quantity: quantity.toString?.() ?? String(quantity),
      rewardedAt
    });
  } catch (err) {
    console.error("POST /reward error:", err.message);
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;
