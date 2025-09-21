import mongoose from "mongoose";

const StockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, uppercase: true, unique: true },
    name: { type: String, required: true },
    exchange: { type: String, enum: ["NSE", "BSE"], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Stock", StockSchema);
