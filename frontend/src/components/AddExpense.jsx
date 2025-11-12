import React, { useState } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AddExpense() {
  const { id: carId } = useParams(); // get carId from URL
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/cars/${carId}/expenses`, {
        type,
        amount: Number(amount),
      });

      setType("");
      setAmount("");
      alert("✅ Expense added successfully!");
      navigate("/cars"); // go back to car list after adding expense
    } catch (error) {
      console.error("❌ Error adding expense:", error);
      alert("Failed to add expense");
    }
  };

  return (
    <div className="card mt-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Add Expense</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Expense Type
            </label>
            <input
              id="type"
              type="text"
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., Tire, Body, Parts"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 2500"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Add Expense
          </button>
          <Link to="/cars" className="btn btn-secondary w-100 mt-2 text-white">
            Cars
          </Link>
        </form>
      </div>
    </div>
  );
}
