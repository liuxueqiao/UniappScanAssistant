const express = require("express");
const { authRequired } = require("../middleware/auth");
const { createTeam, joinTeam, leaveTeam, getMyTeam } = require("../controllers/team.controller");

const router = express.Router();

router.get("/me", authRequired, getMyTeam);
router.post("/", authRequired, createTeam);
router.post("/join", authRequired, joinTeam);
router.post("/leave", authRequired, leaveTeam);

module.exports = router;

