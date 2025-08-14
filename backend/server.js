// backend/server.js or backend/app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const transactionRoutes = require("./routes/transactionRoutes"); // Your existing route
const authRoutes = require("./routes/auth"); // New auth route

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/transactions", transactionRoutes); // Your existing route
app.use("/api/auth", authRoutes); // Add this line for authentication routes

// MongoDB connection (if not already present)
mongoose.connect("mongodb://127.0.0.1:27017/expense-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
