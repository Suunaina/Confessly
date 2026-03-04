import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email, password }
        );

        // Store token and role
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        // Reload app
        window.location.href = "/";
      } else {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          { name, email, password }
        );

        alert("Registered successfully! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Something went wrong. Please try again.";

      alert(message);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p
          style={{ marginTop: "15px", cursor: "pointer" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default Login;