const express = require("express");
const { authRequired } = require("../middleware/auth");
const { getCurrent, join, getTeamRank } = require("../controllers/challenge.controller");

const router = express.Router();

router.get("/current", authRequired, getCurrent);
router.post("/join", authRequired, join);
router.get("/team-rank", authRequired, getTeamRank);

module.exports = router;

