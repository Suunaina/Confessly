const mongoose = require("mongoose");

const confessionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 300
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Confession", confessionSchema);