import mongoose from "mongoose";
const D128 = mongoose.Schema.Types.Decimal128;

const HoldingSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, required: true },
    symbol: { type: String, index: true, required: true },
    quantity: { type: D128, required: true },
    asOf: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

HoldingSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export default mongoose.model("Holding", HoldingSchema);
