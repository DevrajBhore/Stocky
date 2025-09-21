import "dotenv/config";
import mongoose from "mongoose";
import Holding from "../models/Holding.js";
import EODPortfolio from "../models/EODPortfolio.js";
import { mockPriceINR } from "../utils/mockPrice.js";

function yyyyMmDd(d) {
  const iso = new Date(d).toISOString();
  return iso.slice(0, 10); 
}

async function main() {
  if (!process.env.MONGO_URL) throw new Error("Missing MONGO_URL");
  await mongoose.connect(process.env.MONGO_URL);
  console.log("✅ DB connected");

  const dateEnv = process.env.DATE;
  let targetDate;
  if (dateEnv) {
    targetDate = dateEnv;
  } else {
    const y = new Date();
    y.setUTCDate(y.getUTCDate() - 1);
    y.setUTCHours(0, 0, 0, 0);
    targetDate = yyyyMmDd(y);
  }

  console.log(`Saving EOD totals for ${targetDate}`);

  const users = await Holding.aggregate([{ $group: { _id: "$userId" } }]);

  let saved = 0;
  for (const u of users) {
    const userId = u._id;
    const holdings = await Holding.find({ userId }).lean();

    let total = 0;
    for (const h of holdings) {
      const qty = Number(h.quantity);  
      const price = mockPriceINR(h.symbol); 
      total += qty * price;
    }

    await EODPortfolio.updateOne(
      { userId, date: targetDate },
      { $set: { totalValueINR: total.toFixed(4) } },
      { upsert: true }
    );
    saved++;
  }

  console.log(`EOD saved for ${saved} user(s)`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("EOD save error:", e.message);
  process.exit(1);
});
