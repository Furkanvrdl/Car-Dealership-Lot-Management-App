import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
    <footer
      className="bg-dark text-light py-3 mt-auto"
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <p className="mb-2 mb-md-0">
          © {new Date().getFullYear()} Car Dealership Manager
        </p>

        <div className="d-flex gap-3">
          <a
            href="https://site.manheim.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light text-decoration-none"
          >
            Manheim
          </a>
          <a
            href="https://cleanairforce.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light text-decoration-none"
          >
            Clean Air Force
          </a>
          <a
            href="https://www.car-part.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light text-decoration-none"
          >
            Car Part
          </a>
          <a
            href="https://www.centraldispatch.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light text-decoration-none"
          >
            Central Dispatch
          </a>
        </div>
      </div>
    </footer>
  );
}
