const express = require("express");
const Transaction = require("../models/Transaction");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Get all transactions for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new transaction
router.post("/", authenticateToken, async (req, res) => {
  try {
    const transaction = new Transaction({
      type: req.body.type,
      amount: req.body.amount,
      description: req.body.description || "",
      userId: req.userId,
      date: req.body.date || new Date(),
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error saving transaction:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
