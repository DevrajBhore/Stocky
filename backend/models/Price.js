import mongoose from "mongoose";
const D128 = mongoose.Schema.Types.Decimal128;

const PriceSchema = new mongoose.Schema(
  {
    symbol: { type: String, index: true, required: true },
    kind: { type: String, enum: ["INTRADAY", "EOD"], index: true, required: true },
    priceINR: { type: D128, required: true },
    takenAt: { type: Date, index: true, required: true },
  },
  { timestamps: true, versionKey: false }
);

PriceSchema.index({ symbol: 1, kind: 1, takenAt: -1 });

export default mongoose.model("Price", PriceSchema);
