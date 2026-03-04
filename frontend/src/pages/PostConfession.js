import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostConfession() {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (!text.trim()) return;
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/confessions",
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // redirect to home after posting
      navigate("/");

    } catch (err) {
      alert("Failed to post confession");
    }
  };

  // allow ENTER key to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">Post a Confession</h2>

      <form className="post-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your confession..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          required
        />

        <div className="post-bottom">
          <span>Stay anonymous.</span>

          <button type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostConfession;