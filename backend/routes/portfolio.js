import express from "express";
import Holding from "../models/Holding.js";
import { mockPriceINR } from "../utils/mockPrice.js";

const router = express.Router();

router.get("/portfolio/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const holdings = await Holding.find({ userId }).lean();

    let total = 0;
    const positions = holdings.map(h => {
      const qty = Number(h.quantity);  
      const lastPrice = mockPriceINR(h.symbol); 
      const value = qty * lastPrice;
      total += value;
      return {
        symbol: h.symbol,
        quantity: qty.toFixed(6),
        lastPrice: lastPrice.toFixed(4),
        value: value.toFixed(4)
      };
    });

    return res.json({
      userId,
      asOf: new Date().toISOString(),
      currency: "INR",
      positions,
      totals: {
        quantityDistinct: positions.length,
        value: total.toFixed(4)
      }
    });
  } catch (err) {
    console.error("GET /portfolio error:", err.message);
    return res.status(500).json({ error: "server_error" });
  }
});

export default router;
