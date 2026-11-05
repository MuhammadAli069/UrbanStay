// The Express app on its own, without app.listen(), so it can run both
// locally (index.js) and as a Vercel serverless function (api/index.js).
require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""));

app.use(cors({ origin: allowedOrigins, credentials: true }));
// Vercel caps request bodies at 4.5 MB, which is plenty for the compressed listing photos.
app.use(express.json({ limit: "4mb" }));

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Make sure MongoDB is connected before any API route runs.
// Locally this resolves instantly; on Vercel it connects on the first request of a cold start.
app.use("/api", async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    res.status(503).json({ message: "Database is unavailable, please try again shortly" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
