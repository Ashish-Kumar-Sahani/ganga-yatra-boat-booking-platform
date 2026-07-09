import dotenv from "dotenv";
import path from "path";

// ✅ Absolute safe path resolve
dotenv.config({
  path: path.resolve("C:/Users/ak694/Coding/security/.env")
});

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 7000;

// ✅ Debug (remove after testing)
console.log("ENV CHECK:", process.env.MONGO_URI ? "Loaded" : "Missing");

// ✅ Connect DB
connectDB();

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});