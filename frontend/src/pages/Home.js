import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {};
        if (token) config.headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(
          "http://localhost:5000/api/confessions",
          config
        );
        setConfessions(res.data);
      } catch (err) {
        console.error("fetch confessions failed", err);
        // if unauthorized, send the user to login page
        if (err.response && err.response.status === 401) {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConfessions();
  }, []);

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in to like a confession.");

      const confession = confessions.find(c => c._id === id);
      const endpoint = confession.liked ? "/unlike" : "/like";

      const res = await axios.put(
        `http://localhost:5000/api/confessions/${id}${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConfessions(
        confessions.map((conf) =>
          conf._id === id
            ? { ...conf, likes: res.data.likes, liked: !conf.liked }
            : conf
        )
      );
    } catch (err) {
      console.error(err);
    }
  };




  const role = localStorage.getItem("role");

  if (loading)
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div className="container">
      <h2 style={{ marginBottom: "25px" }}>All Confessions</h2>

      {confessions.length === 0 ? (
        <p>No confessions yet. { /* maybe instruct user to log in to post */ }
          {role ? null : " (log in to add one)"}
        </p>
      ) : (
        confessions.map((conf) => (
          <div key={conf._id} className="card">
            <p>{conf.text}</p>

            <div className="card-footer">
              <div className="btn-group">
                <button
                  className={"like-btn " + (conf.liked ? "liked" : "")}
                  onClick={() => handleLike(conf._id)}
                >
                  {conf.liked ? "❤️" : "🤍"} {conf.likes}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;