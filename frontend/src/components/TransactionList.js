// frontend/src/components/TransactionList.js
import React from "react";

const TransactionList = ({ transactions }) => {
  return (
    <div className="transaction-list">
      <h3>All Transactions</h3>
      <ul>
        {transactions.length === 0 ? (
          <li>No transactions yet</li>
        ) : (
          transactions.map((t) => {
            // Format date string to human-readable
            const formattedDate = new Date(t.date).toLocaleString();
            return (
              <li key={t._id}>
                {t.type} – ₹{t.amount}
                {t.description && `: ${t.description}`}{" "}
                <span style={{ fontSize: "0.85em", color: "#555" }}>
                  ({formattedDate})
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default TransactionList;
