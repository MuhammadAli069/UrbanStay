const mongoose = require("mongoose");

// Reuse one connection. On Vercel, a warm function keeps it between requests.
let connecting = null;

const connectDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);

  if (!process.env.MONGO_URI) {
    return Promise.reject(new Error("MONGO_URI is missing. Copy .env.example to .env and fill it in."));
  }

  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .then((m) => {
        console.log("MongoDB connected");
        return m.connection;
      })
      .catch((err) => {
        connecting = null; // allow a retry on the next request
        throw err;
      });
  }
  return connecting;
};

module.exports = connectDB;
