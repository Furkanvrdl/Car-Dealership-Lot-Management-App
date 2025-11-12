import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    soldCars: 0,
    totalProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    document.title = "Dashboard | Lot Manager";
  });

  const fetchDashboardData = async () => {
    try {
      // Fetch total cars and sold cars in parallel eith Promise.all(). This improves performance by reducing wait time.
      const [carsRes, soldCarsRes] = await Promise.all([
        api.get("/cars"),
        api.get("/soldCars"),
      ]);

      const totalProfit = soldCarsRes.data.soldCars?.reduce(
        (sum, car) => sum + (car.profit || 0),
        0
      );

      setStats({
        totalCars: carsRes.data.cars?.length || 0,
        soldCars: soldCarsRes.data.soldCars?.length || 0,
        totalProfit: totalProfit || 0,
      });
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      if (error.response?.satus === 401) {
        alert("❌ Session expired. Please log in again.");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status" />
        </div>
      );
    }
  };

  return (
    <div className="mt-4">
      <h2 className="mb-4 text-center">Dashboard</h2>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="text-center">
              <h5>Total Cars</h5>
              <h2>{stats.totalCars}</h2>
              <Link to="/cars" className="btn btn-outline-primary btn-sm mt-2">
                View Cars
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="text-center">
              <h5>Total Sold Cars</h5>
              <h2 className="text-success">{stats.soldCars}</h2>
              <Link
                to="/soldcars"
                className="btn btn-outline-primary btn-sm mt-2"
              >
                View Sold Cars
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="text-center">
              <h5>Total Profit</h5>
              <h2 className="text-danger mb-5">
                ${stats.totalProfit.toLocaleString()}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Quick Actions */}
      <div className="text-center mt-5">
        <h4 className="mb-3">Quick Actions</h4>
        <Button
          variant="primary"
          className="me-2"
          onClick={() => navigate("/cars/add")}
        >
          + Add New Car
        </Button>
        <Button variant="outline-secondary" onClick={() => navigate("/cars")}>
          Manage Cars
        </Button>
      </div>
    </div>
  );
}
