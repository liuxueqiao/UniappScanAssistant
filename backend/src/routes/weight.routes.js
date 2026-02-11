const express = require("express");
const { authRequired } = require("../middleware/auth");
const { checkIn, getHistory } = require("../controllers/weight.controller");

const router = express.Router();

router.post("/check-in", authRequired, checkIn);
router.get("/history", authRequired, getHistory);

module.exports = router;

