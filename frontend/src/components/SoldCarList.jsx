import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function SoldCarList() {
  const [soldCars, setSoldCars] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSoldCars = async (pageNum = 1) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await api.get(`/soldCars?page=${pageNum}&limit=5`);
      setSoldCars(res.data.soldCars || []);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      console.error("❌ Error fetching sold cars:", err);
      setError("Failed to fetch sold cars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldCars(page); // Fetch sold cars when component mounts or page changes
    document.title = "Sold Cars";
  }, [page]);

  // Export CSV
  const handleExportCSV = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.get("/soldCars/export/csv", {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sold_cars.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Failed to export CSV:", err);
      setError("Failed to export CSV. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Export PDF
  const handleExportPDF = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.get("/soldCars/export/pdf", {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sold_cars_report.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Failed to export PDF:", err);
      setError("Failed to export PDF. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Sold Cars</h3>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={handleExportCSV}
            disabled={submitting}
            aria-label="Export sold cars as CSV"
          >
            {submitting ? "Exporting..." : "Export CSV"}
          </button>
          <button
            className="btn btn-danger"
            onClick={handleExportPDF}
            disabled={submitting}
            aria-label="Export sold cars as PDF"
          >
            {submitting ? "Exporting..." : "Export PDF"}
          </button>
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
          <table className="table table-striped table-hover text-center align-middle ">
            <thead className="table-dark">
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>VIN</th>
                <th>Purchase ($)</th>
                <th>Sale ($)</th>
                <th>Expenses ($)</th>
                <th>Profit ($)</th>
                <th>Sold Date</th>
              </tr>
            </thead>
            <tbody>
              {soldCars.length > 0 ? (
                soldCars.map((car) => (
                  <tr key={car._id}>
                    <td>{car.make}</td>
                    <td>{car.model}</td>
                    <td>{car.year}</td>
                    <td>{car.vin}</td>
                    <td>{car.purchasePrice?.toLocaleString()}</td>
                    <td>{car.salePrice?.toLocaleString()}</td>
                    <td>{car.totalExpenses?.toLocaleString()}</td>
                    <td
                      className={
                        car.profit >= 0
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {car.profit?.toLocaleString()}
                    </td>
                    <td>
                      {car.soldDate
                        ? new Date(car.soldDate).toLocaleDateString()
                        : "—"}
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
              <button
                className="page-link"
                onClick={() => setPage(page - 1)}
                aria-label="Previous page"
              >
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
    </div>
  );
}
