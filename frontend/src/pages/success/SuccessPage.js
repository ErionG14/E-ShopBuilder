import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SuccessPage.css";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="checkmark-wrapper">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>

        <h1 className="success-title">Payment Successful!</h1>
        <p className="success-subtitle">
          Thank you for your purchase from <strong>E-ShopBuilder</strong>.
        </p>

        {orderId && (
          <div className="order-details">
            <span className="order-label">Order Reference</span>
            <h3 className="order-number">#{orderId}</h3>
            <p className="order-status-msg">
              Your order has been confirmed and is now being processed.
            </p>
          </div>
        )}

        <div className="action-area">
          <button className="primary-btn" onClick={() => navigate("/orders")}>
            View My Orders
          </button>
          <button className="secondary-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;