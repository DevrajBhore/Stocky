import express from "express";
import EODPortfolio from "../models/EODPortfolio.js";

const router = express.Router();

router.get("/historical-inr/:userId", async (req, res) => {
  try {
    const raw = req.params.userId;
    const userId = String(raw).trim();
    const { from, to } = req.query;

    const q = { userId };
    if (from || to) {
      q.date = {};
      if (from) q.date.$gte = String(from);
      if (to) q.date.$lte = String(to);
    }

    const rows = await EODPortfolio.find(q).sort({ date: 1 }).lean();

    return res.json({
      userId,
      currency: "INR",
      series: rows.map((r) => ({
        date: r.date,
        totalValue: r.totalValueINR.toString()
      })),
      pricingSource: "mock_price_service_eod",
      note: "Excludes today's partial day. Values saved by a simple daily script."
    });
  } catch (err) {
    console.error("GET /historical-inr error:", err.message);
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;
