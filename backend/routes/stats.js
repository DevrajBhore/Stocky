import express from "express";
import RewardEvent from "../models/RewardEvent.js";
import Holding from "../models/Holding.js";
import { mockPriceINR } from "../utils/mockPrice.js";

const router = express.Router();

router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const start = new Date(); start.setUTCHours(0, 0, 0, 0);

    const todayAgg = await RewardEvent.aggregate([
      { $match: { userId, rewardedAt: { $gte: start } } },
      { $group: { _id: "$symbol", qty: { $sum: "$quantity" } } },
      { $project: { _id: 0, symbol: "$_id", quantity: { $toString: "$qty" } } }
    ]);

    const holdings = await Holding.find({ userId }).lean();
    let total = 0;
    const asOf = new Date();

    for (const h of holdings) {
      const qty = Number(h.quantity);
      const lastPrice = mockPriceINR(h.symbol);
      total += qty * lastPrice;
    }

    return res.json({
      userId,
      today: {
        bySymbol: todayAgg,
        asOf: new Date().toISOString()
      },
      portfolio: {
        valueINR: total.toFixed(4),
        asOf: asOf.toISOString(),
        pricingSource: "mock_price_service"
      }
    });
  } catch (err) {
    console.error("GET /stats error:", err.message);
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;
