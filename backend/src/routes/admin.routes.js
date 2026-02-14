const express = require("express");
const { adminRequired } = require("../middleware/admin");
const { listUsers, listTeams, listWeights, listChallenges, listArticles, createChallenge } = require("../controllers/admin.controller");

const router = express.Router();

router.get("/users", adminRequired, listUsers);
router.get("/teams", adminRequired, listTeams);
router.get("/weights", adminRequired, listWeights);
router.get("/challenges", adminRequired, listChallenges);
router.get("/articles", adminRequired, listArticles);
router.post("/challenges", adminRequired, createChallenge);

module.exports = router;
