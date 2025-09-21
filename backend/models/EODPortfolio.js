import mongoose from "mongoose";
const D128 = mongoose.Schema.Types.Decimal128;

const EODPortfolioSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, required: true },
    date: { type: String, index: true, required: true },
    totalValueINR: { type: D128, required: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("EODPortfolio", EODPortfolioSchema);
