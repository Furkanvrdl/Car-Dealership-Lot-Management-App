import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  //Focus states for validation messages
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  useEffect(() => {
    document.title = "Register | Lot Manager";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", { username, password });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/");
  };

  //REGEX validation functions
  const isPasswordValid = (password) => {
    const pattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return pattern.test(password);
  };

  const isUsernameValid = (username) => {
    const pattern = /^[a-zA-Z0-9]{3,16}$/;
    return pattern.test(username);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-4">
        <div className="card shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">
              Create a new account
            </h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-3">
                <input
                  id="username"
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setUsernameFocus(true)}
                  usernameFocus={usernameFocus.toString()}
                  required
                  placeholder="Username"
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "red",
                    display:
                      !isUsernameValid(username) && usernameFocus === true
                        ? "block"
                        : "none",
                    padding: "3px",
                  }}
                >
                  Username should be 3-16 characters and shouldn't include any
                  special character!
                </span>
              </div>

              {/* Password */}

              <div className="mb-3">
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  onBlur={() => setPasswordFocus(true)}
                  passwordFocus={passwordFocus.toString()}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "red",
                    display:
                      !isPasswordValid(password) && passwordFocus === true
                        ? "block"
                        : "none",
                    padding: "3px",
                  }}
                >
                  Password should be 8-20 characters and include at least 1
                  letter, 1 number, and 1 special character!
                </span>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setConfirmFocus(true)}
                  confirmFocus={confirmFocus.toString()}
                  required
                  placeholder="Confirm password"
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: "red",
                    display: password !== confirmPassword ? "block" : "none",
                    padding: "3px",
                  }}
                >
                  Passwords don't match!
                </span>
                <hr />
              </div>
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100 "
                  disabled={
                    !username ||
                    !isPasswordValid(password) ||
                    password !== confirmPassword ||
                    loading
                  }
                >
                  Sign up
                </button>

                <button onClick={goToLogin} className="btn btn-primary w-100">
                  Already have an account?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
