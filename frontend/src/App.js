// frontend/src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Header from "./components/Header";
import TransactionChart from "./components/TransactionChart";
import TransactionList from "./components/TransactionList";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const API_URL = "http://localhost:5000/api/transactions";

// Create a separate component for the main app content
const AppContent = () => {
  const [transactions, setTransactions] = useState([]);
  const { isAuthenticated, loading, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchTransactions();
    }
  }, [isAuthenticated, token]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log("API returned:", res.data);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const addTransaction = async (type, amount, description) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    try {
      console.log(
        "Adding transaction with token:",
        token ? "Token present" : "No token",
      );

      const res = await axios.post(
        API_URL,
        { type, amount, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTransactions((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Detailed error adding transaction:", err);
      console.error("Error response:", err.response?.data);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <Header />
        <div className="main-container">
          <div className="login-prompt">
            <h2>Welcome to Paysa</h2>
            <p>Please login to manage your expenses and income.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="app-container">
      <Header />
      <div className="main-container">
        <div className="balance-box">
          <h2>Current Balance</h2>
          <div className="balance-amount">₹{balance}</div>
        </div>
        <div className="input-row">
          <AddTransactionBox
            label="Add Income"
            buttonLabel="Add Income"
            type="income"
            onAdd={(amount, description) =>
              addTransaction("income", amount, description)
            }
          />
          <AddTransactionBox
            label="Add Expense"
            buttonLabel="Add Expense"
            type="expense"
            onAdd={(amount, description) =>
              addTransaction("expense", amount, description)
            }
          />
        </div>
        <TransactionChart transactions={transactions} />
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

// Main App component - this is where the AuthProvider should wrap everything
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AddTransactionBox = ({ label, buttonLabel, onAdd }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(amount, description);
    setAmount("");
    setDescription("");
  };

  return (
    <form className="add-box" onSubmit={handleSubmit}>
      <label>{label}</label>
      <input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
      />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default App;
