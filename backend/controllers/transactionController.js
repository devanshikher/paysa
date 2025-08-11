const Transaction = require("../models/Transaction");

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions); // Ensure the date field is returned here
  } catch (error) {
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Public
const addTransaction = async (req, res) => {
  const { type, amount, description } = req.body;

  if (!type || !amount) {
    return res.status(400).json({ message: "Type and amount are required" });
  }

  try {
    const newTransaction = new Transaction({
      type,
      amount,
      description,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Server error adding transaction" });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
};
