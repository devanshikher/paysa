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
  // Aggregate data by date
  const dataMap = {};

  transactions.forEach(({ date, type, amount }) => {
    const d = new Date(date).toISOString().split("T")[0]; // Format YYYY-MM-DD
    if (!dataMap[d]) dataMap[d] = { date: d, income: 0, expense: 0 };
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
  const chartData = sortedDates.map((date) => {
    cumulativeIncome += dataMap[date].income;
    cumulativeExpense += dataMap[date].expense;
    return {
      date,
      Income: cumulativeIncome,
      Expense: cumulativeExpense,
      Balance: cumulativeIncome - cumulativeExpense,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
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
