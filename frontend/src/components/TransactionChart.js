// frontend/src/components/TransactionChart.js
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TransactionChart = ({ transactions }) => {
  // Aggregate transactions by date
  const dataMap = {};

  transactions.forEach(({ date, type, amount }) => {
    // Check for missing date
    if (!date) {
      console.warn("Skipping transaction without date", { type, amount });
      return;
    }

    // Parse and validate
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.warn("Skipping invalid date:", date);
      return;
    }

    // Format YYYY-MM-DD
    const d = parsedDate.toISOString().split("T")[0];

    // Initialize if not present
    if (!dataMap[d]) {
      dataMap[d] = { date: d, income: 0, expense: 0 };
    }

    if (type === "income") {
      dataMap[d].income += amount;
    } else if (type === "expense") {
      dataMap[d].expense += amount;
    }
  });

  // Sort dates and compute cumulative totals
  const sortedDates = Object.keys(dataMap).sort();
  let cumulativeIncome = 0;
  let cumulativeExpense = 0;

  const chartData = sortedDates.map((dateKey) => {
    cumulativeIncome += dataMap[dateKey].income;
    cumulativeExpense += dataMap[dateKey].expense;
    return {
      date: dateKey,
      Income: cumulativeIncome,
      Expense: cumulativeExpense,
      Balance: cumulativeIncome - cumulativeExpense,
    };
  });

  // If no valid data, show an empty message
  if (chartData.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#777" }}>
        No valid transaction data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(str) => {
            const date = new Date(str);
            // Show e.g., "Aug 13"
            return isNaN(date)
              ? str
              : date.toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                });
          }}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(label) => {
            const date = new Date(label);
            return isNaN(date)
              ? label
              : date.toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Income"
          stroke="#3CB371"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="Expense"
          stroke="#FF4C4C"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="Balance"
          stroke="#0077b6"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TransactionChart;
