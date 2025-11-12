import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AddCar() {
  const navigate = useNavigate();
  const [car, setCar] = useState({
    vin: "",
    make: "",
    model: "",
    year: "",
    purchasePrice: "",
    // status: "available",
    expenses: [],
    totalExpenses: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Add New Car";
  }, []);
  // Handle form input changes
  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // car state = holds the live form values.
      // data object = ensures proper format and cleans data before sending to the backend.
      const newCar = {
        vin: car.vin,
        make: car.make,
        model: car.model,
        year: Number(car.year),
        purchasePrice: Number(car.purchasePrice),
        // status: car.status,
        expenses: car.expenses,
        totalExpenses: Number(car.totalExpenses),
      };

      await api.post("/cars", newCar);
      alert("✅ New car added successfully!");
      navigate("/cars");
    } catch (err) {
      console.error("❌ Error adding new car:", err);
      alert("❌ Failed to add new car. Please try again.");
    } finally {
      setLoading(false); // Ensure loading is reset in both success and error cases
    }
  };

  //Dynamic form fields.(trying new stuff)
  //{field.charAt(0).toUpperCase() + field.slice(1)} just for the make the first letter uppercase then concatenate them like "V + "in" = Vin yay lol.
  return (
    <div className="card p-4 shadow-sm">
      <h4 className="mb-3">Add New Car</h4>
      <form onSubmit={handleSubmit}>
        {["vin", "make", "model", "year", "purchasePrice"].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={
                field === "year" || field === "purchasePrice"
                  ? "number"
                  : "text"
              }
              name={field}
              value={car[field]}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        ))}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Car"}
        </button>
      </form>
    </div>
  );
}
