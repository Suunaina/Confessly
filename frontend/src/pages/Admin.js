import React, { useState, useEffect } from "react";
import axios from "axios";

function Admin() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {};
        if (token) config.headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get("http://localhost:5000/api/confessions", config);
        setConfessions(res.data);
      } catch (err) {
        console.error("Failed to fetch confessions", err);
        if (err.response && err.response.status === 401) {
          // token missing/invalid -> ask user to login again
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this confession?"))
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return window.location.href = "/login";
      await axios.delete(`http://localhost:5000/api/confessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfessions(confessions.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete confession");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="container">
        <h2>Loading confessions...</h2>
      </div>
    );

  return (
    <div className="container">
      <h2 style={{ marginBottom: "25px" }}>Admin Panel</h2>
      {confessions.length === 0 ? (
        <p>No confessions yet.</p>
      ) : (
        confessions.map((conf) => (
          <div key={conf._id} className="card">
            <p>{conf.text}</p>
            <div style={{ marginTop: "15px" }}>
              <button
                className="delete-btn"
                onClick={() => handleDelete(conf._id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;