// frontend/src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import TransactionChart from "./components/TransactionChart";

const API_URL = "http://localhost:5000/api/transactions";

const App = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

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
      const res = await axios.post(API_URL, {
        type,
        amount: Number(amount),
        description: description || "",
      });
      setTransactions((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
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

const TransactionList = ({ transactions }) => {
  return (
    <div className="transaction-list">
      <h3>All Transactions</h3>
      <ul>
        {transactions.length === 0 && <li>No transactions yet</li>}
        {transactions.map((t) => (
          <li key={t._id} className={t.type}>
            <strong>{t.type.toUpperCase()}</strong> - ₹{t.amount}
            {t.description && `: ${t.description}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
