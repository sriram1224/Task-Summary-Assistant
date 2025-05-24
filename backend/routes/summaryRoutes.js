const express = require("express");
const router = express.Router();
const { summarizeTodos } = require("../controller/summaryController");
const { authMiddleware } = require("../middleware/authmiddleware");

router.get("/", authMiddleware, summarizeTodos);
router.post("/", authMiddleware, summarizeTodos);

module.exports = router;
