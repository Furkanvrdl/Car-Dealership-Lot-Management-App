import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { Modal, Button, Form } from "react-bootstrap";

export default function CarList() {
  const [cars, setCars] = useState([]); // State to hold the list of cars
  const [showSellModal, setShowSellModal] = useState(false); // State to control sell modal visibility
  const [selectedCar, setSelectedCar] = useState(null); // State to hold the car being sold
  const [salePrice, setSalePrice] = useState(""); // State to hold the sale price input
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch cars from the backend when the component mounts
  useEffect(() => {
    fetchCars(page);
    document.title = "Available Cars";
  }, [page]); // Fetch cars on component mount

  // Function to fetch cars from the backend API
  const fetchCars = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/cars?page=${pageNum}&limit=5`);
      setCars(res.data.cars);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (error) {
      console.error("❌ Error fetching cars:", error);
      setError("Failed to fetch sold cars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //open sell modal
  const openSellModal = (car) => {
    setSelectedCar(car);
    setSalePrice("");
    setShowSellModal(true);
  };

  //submit sell car
  const submitSell = async () => {
    const priceNumber = Number(salePrice);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert("Please enter a valid sale price.");
      return;
    }

    try {
      await api.put(`/cars/${selectedCar._id}/sell`, {
        salePrice: priceNumber,
      });
      setShowSellModal(false);
      fetchCars(); // Refresh the car list after selling
    } catch (error) {
      console.error("Error selling car:", error);
    }
  };

  const handleExportCSV = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.get("/cars/export/csv", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "text/csv" }); // Create a Blob from the response data
      const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
      const a = document.createElement("a"); // Create a temporary anchor element
      a.href = url; // Set the href to the Blob URL
      a.download = "Available_cars.csv"; // Set the desired file name
      a.click(); // Programmatically click the anchor to trigger the download
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("❌ Error exporting CSV:", error);
      setError("Failed to export CSV. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportPDF = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.get("/cars/export/pdf", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" }); // Create a Blob from the response data
      const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
      const a = document.createElement("a"); // Create a temporary anchor element
      a.href = url; // Set the href to the Blob URL
      a.download = "Available_cars.pdf"; // Set the desired file name
      a.click(); // Programmatically click the anchor to trigger the download
      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("❌ Error exporting PDF:", error);
      setError("Failed to export PDF. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Available Cars</h3>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={handleExportCSV}
            disabled={submitting}
            aria-label="Export available cars as CSV"
          >
            {submitting ? "Exporting..." : "Export CSV"}
          </button>
          <button
            className="btn btn-danger"
            onClick={handleExportPDF}
            disabled={submitting}
            aria-label="Export available cars as PDF"
          >
            {submitting ? "Exporting..." : "Export PDF"}
          </button>
          <Link to="/cars/add" className="btn btn-primary ms-2">
            + Add Car
          </Link>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>VIN</th>
                <th>Purchase Price ($)</th>
                <th>Expenses ($)</th>
                <th>Total Expenses ($)</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {cars.length > 0 ? (
                cars.map((car) => (
                  <tr key={car._id}>
                    <td>{car.make}</td>
                    <td>{car.model}</td>
                    <td>{car.year}</td>
                    <td>{car.vin}</td>
                    <td>${car.purchasePrice.toLocaleString()}</td>
                    <td>
                      {car.expenses && car.expenses.length > 0
                        ? car.expenses.map((exp, index) => (
                            <div key={index}>
                              {exp.type}: ${exp.amount.toLocaleString()}
                            </div>
                          ))
                        : "No expenses"}
                    </td>
                    <td>${car.totalExpenses.toLocaleString()}</td>
                    <td>{new Date(car.purchaseDate).toLocaleDateString()}</td>
                    <td>
                      <Link
                        to={`/cars/edit/${car._id}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/cars/${car._id}/expenses`}
                        className="btn btn-info btn-sm me-2"
                      >
                        Add Expense
                      </Link>
                      <button
                        onClick={() => openSellModal(car)}
                        className="btn btn-success btn-sm"
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted">
                    No sold cars found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>
                Previous
              </button>
            </li>

            {[...Array(pages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(i + 1)}
                  aria-label={`Page ${i + 1}`}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${page === pages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(page + 1)}
                aria-label="Next page"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div>
        <Modal show={showSellModal} onHide={() => setShowSellModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sell Car</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCar && (
              <>
                <p>
                  Enter Sale Price For {selectedCar.make} {selectedCar.model} (
                  {selectedCar.year})
                </p>
                <Form.Control
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="Enter Sale Price"
                />
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSellModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={submitSell}>
              Sell
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
