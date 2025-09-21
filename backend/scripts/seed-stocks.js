import "dotenv/config";
import mongoose from "mongoose";
import Stock from "../models/Stock.js";
import User from "../models/User.js";

async function main() {
  try {
    if (!process.env.MONGO_URL) throw new Error("Missing MONGO_URL");
    await mongoose.connect(process.env.MONGO_URL);

    const stocks = [
      { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE" },
      { symbol: "TCS",      name: "Tata Consultancy Services", exchange: "NSE" },
      { symbol: "INFY",     name: "Infosys", exchange: "NSE" },
    ];

    const users = [
      { _id: "usr_demo_1", email: "demo1@example.com" },
      { _id: "usr_demo_2", email: "demo2@example.com" },
    ];

    await Stock.bulkWrite(
      stocks.map(s => ({
        updateOne: {
          filter: { symbol: s.symbol },
          update: { $setOnInsert: s },
          upsert: true
        }
      }))
    );

    await User.bulkWrite(
      users.map(u => ({
        updateOne: {
          filter: { _id: u._id },
          update: { $setOnInsert: u },
          upsert: true
        }
      }))
    );

    console.log("Seeded stocks & users");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

main();
