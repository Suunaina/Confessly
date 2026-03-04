const express = require("express");
const router = express.Router();
const Confession = require("../models/confession");
const verifyToken = require("../middleware/verifyToken");

// GET ALL CONFESSIONS - public endpoint (no login required)
// if a valid token is provided, the middleware will attach req.user;
// otherwise req.user will be undefined and we fall back gracefully
router.get("/", async (req, res) => {
  try {
    // optionally validate token to compute liked flag
    // since this route is public we don't stop when token is missing/invalid
    let currentUserId = null;
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        currentUserId = decoded.id;
      } catch (e) {
        // invalid token – ignore and act as guest
        currentUserId = null;
      }
    }

    const confessions = await Confession.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    // attach liked flag based on current user (if any)
    const transformed = confessions.map((c) => ({
      _id: c._id,
      text: c.text,
      likes: c.likes,
      liked: !!(
        currentUserId &&
        c.likedBy &&
        c.likedBy.includes(currentUserId)
      ),
      userId: c.userId,
      createdAt: c.createdAt
    }));

    res.json(transformed);
  } catch (err) {
    res.status(500).json({ message: "Error fetching confessions" });
  }
});

// POST CONFESSION
router.post("/", verifyToken, async (req, res) => {
  try {
    const newConfession = new Confession({
      text: req.body.text,
      userId: req.user.id
    });

    await newConfession.save();
    res.status(201).json(newConfession);
  } catch (err) {
    res.status(500).json({ message: "Error posting confession" });
  }
});

// LIKE CONFESSION
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession)
      return res.status(404).json({ message: "Not found" });

    const isLiked = confession.likedBy.some(id => id.toString() === req.user.id.toString());
    
    if (isLiked) {
      return res.status(400).json({ message: "Already liked" });
    }

    confession.likes += 1;
    confession.likedBy.push(req.user.id);

    await confession.save();
    res.json({ _id: confession._id, likes: confession.likes, liked: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error liking confession" });
  }
});

// UNLIKE CONFESSION
router.put("/:id/unlike", verifyToken, async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession)
      return res.status(404).json({ message: "Not found" });

    const isLiked = confession.likedBy.some(id => id.toString() === req.user.id.toString());
    
    if (!isLiked) {
      return res.status(400).json({ message: "Not liked" });
    }

    confession.likes -= 1;
    confession.likedBy = confession.likedBy.filter(id => id.toString() !== req.user.id.toString());

    await confession.save();
    res.json({ _id: confession._id, likes: confession.likes, liked: false });

  } catch (err) {
    res.status(500).json({ message: "Error unliking confession" });
  }
});



// DELETE (ADMIN ONLY)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Confession.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting" });
  }
});

module.exports = router;