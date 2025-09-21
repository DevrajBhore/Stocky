import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", UserSchema);
