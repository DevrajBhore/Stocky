import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rewardRoutes from "./routes/reward.js";
import todayRoutes from "./routes/today.js";
import statsRoutes from "./routes/stats.js";
import portfolioRoutes from "./routes/portfolio.js";
import historicalRoutes from "./routes/historical.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("STOCKY API is running!");
});

app.use("/api", rewardRoutes);
app.use("/api", todayRoutes);
app.use("/api", statsRoutes);
app.use("/api", portfolioRoutes);
app.use("/api", historicalRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });
