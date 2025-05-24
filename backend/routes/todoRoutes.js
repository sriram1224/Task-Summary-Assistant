const express = require("express");
const router = express.Router();
const {
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controller/TodoController");

const { authMiddleware } = require("../middleware/authmiddleware");

router.get("/", authMiddleware, getTodo);
router.post("/", authMiddleware, createTodo);
router.put("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);

module.exports = router;
