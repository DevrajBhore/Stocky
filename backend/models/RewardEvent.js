import mongoose from "mongoose";
const D128 = mongoose.Schema.Types.Decimal128;

const RewardEventSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, ref: "User", index: true, required: true },
    symbol: { type: String, ref: "Stock", index: true, required: true },
    quantity: { type: D128, required: true },
    rewardedAt: { type: Date, required: true },
    campaignId: { type: String },
    reason: { type: String },
    idempotencyKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true, versionKey: false }
);

RewardEventSchema.index({ userId: 1, rewardedAt: 1 });

export default mongoose.model("RewardEvent", RewardEventSchema);
