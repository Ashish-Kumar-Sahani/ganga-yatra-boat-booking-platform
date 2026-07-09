import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    state: { type: String, required: true },
    riverName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export  const City = mongoose.model("City", citySchema);
export default City;