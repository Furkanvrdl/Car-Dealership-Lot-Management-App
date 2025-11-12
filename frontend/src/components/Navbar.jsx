import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  let token = null;
  const navigate = useNavigate();

  try {
    token = localStorage.getItem("token");
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    token = null; // Ensure token is null if there's an error
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const guestLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/">
          Log In
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Sign Up
        </Link>
      </li>
    </>
  );
  const authLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/dashbord">
          Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/cars">
          Cars
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/soldcars">
          Sold Cars
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/cars/add">
          Add Car
        </Link>
      </li>
      <li className="nav-item">
        <button
          onClick={handleLogout}
          className="btn btn-outline-light ms-3"
          type="button"
        >
          Logout
        </button>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to={token ? "/dashbord" : "/"}>
          {token ? "CarManager" : "Car Dealership Lot Manager"}
        </Link>
        {/* <div className="text-center mt-3">
          <a
            href="https://site.manheim.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-link"
          >
            Visit Manheim
          </a>
        </div> */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {token ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
}
