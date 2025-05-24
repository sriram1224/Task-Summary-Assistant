const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  category: String,
  labels: [String],
  dueDate: Date,
  recurrence: {
    type: String,
    enum: ["none", "daily", "monthly", "custom"],
    default: "none",
  },
  recurrenceDays: [String],
});
module.exports = mongoose.model("Todo", TodoSchema);
