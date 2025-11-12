import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/style.css";
// import Dashboard from "./Dashboard";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | Lot Manager";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const validateInputs = () => {
    if (!username.trim() === "") {
      setError("Username cannot be empty");
      return false;
    }
    if (!password.trim() === "") {
      setError("Password cannot be empty");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateInputs()) return;

    try {
      const res = await api.post("/auth/login", { username, password });
      // Save token in localStorage
      localStorage.setItem("token", res.data.token);
      // Redirect to dashboard
      navigate("/dashbord");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      // style={{
      //   backgroundImage: `url(${require("../styles/pics/background2.jpg")})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      <div className="col-md-4">
        <div className="card shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-center mb-3">
              Log Into Car Dealership Lot Manager
            </h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  id="username"
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Username"
                />
              </div>

              <div className="mb-3">
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>
              <hr />
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!username || !password || loading}
                >
                  {loading ? "Logging..." : "Log In"}
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={goToRegister}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// or this to go to register
/*<div className="text-center mt-3">
            <small>
              Don’t have an account?{" "}
              <Link to="/register" className="text-primary text-decoration-none">
                Register
              </Link>
            </small>
          </div> */
