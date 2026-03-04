import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) return JSON.parse(stored);
    // fallback to system preference
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) || false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="navbar">
      <div className="logo">Confessly</div>

      <div className="nav-right">
        {token ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/post">Post</Link>
            {role === "admin" && <Link to="/admin">Admin</Link>}

            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Light" : "Dark"}
            </button>

            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Light" : "Dark"}
            </button>
            {!isLoginPage && (
              <Link to="/login" className="login-link-btn">
                <button>Login</button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;