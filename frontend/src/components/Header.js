// frontend/src/components/Header.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <>
      <header className="top-bar">
        <h1 className="app-title">Paysa</h1>

        {isAuthenticated ? (
          <div className="user-info">
            <span className="welcome-text">
              Welcome, {user?.name || user?.email}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        )}
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Header;
