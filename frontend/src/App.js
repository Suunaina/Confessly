import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PostConfession from "./pages/PostConfession";
import Admin from "./pages/Admin";
import "./styles.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    // Listen for storage changes (login/logout from other tabs/windows)
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <NavBar />
      <div className="page-wrapper">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              token ? (
                <Home />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <PostConfession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;