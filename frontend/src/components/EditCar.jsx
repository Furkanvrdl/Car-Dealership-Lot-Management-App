import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState({
    make: "",
    model: "",
    year: "",
    purchasePrice: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        setCar(response.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching car details:", error);
        setError("Failed to load car details. Please try again.");
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  // Submit updated car
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null); // Clear previous errors
    try {
      // Validate inputs
      if (!car.make || !car.model || !car.year || !car.purchasePrice) {
        setError("All fields are required.");
        setSubmitting(false);
        return;
      }

      await api.put(`/cars/${id}`, car);
      alert("✅ Car details updated successfully!");
      navigate("/cars"); // Navigate back to the car list
    } catch (error) {
      console.error("❌ Error updating car details:", error);
      setError("Failed to update car details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-4">Edit Car Details</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <fieldset disabled={submitting}>
              <div className="mb-3">
                <label htmlFor="make" className="form-label">
                  Make
                </label>
                <input
                  id="make"
                  type="text"
                  name="make"
                  className="form-control"
                  value={car.make}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="model" className="form-label">
                  Model
                </label>
                <input
                  id="model"
                  type="text"
                  name="model"
                  className="form-control"
                  value={car.model}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="year" className="form-label">
                  Year
                </label>
                <input
                  id="year"
                  type="number"
                  name="year"
                  className="form-control"
                  value={car.year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="purchasePrice" className="form-label">
                  Purchase Price ($)
                </label>
                <input
                  id="purchasePrice"
                  type="number"
                  name="purchasePrice"
                  className="form-control"
                  value={car.purchasePrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {submitting ? "Submitting..." : "Update Car"}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCar;
