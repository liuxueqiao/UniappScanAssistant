const express = require("express");
const { adminRequired } = require("../middleware/admin");
const { 
  listUsers, listTeams, listWeights, listChallenges, listArticles, 
  createChallenge, createArticle,
  deleteUser, updateUser, 
  deleteTeam, updateTeam, 
  deleteWeight, updateWeight, 
  deleteChallenge, updateChallenge, 
  deleteArticle, updateArticle 
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/users", adminRequired, listUsers);
router.delete("/users/:id", adminRequired, deleteUser);
router.patch("/users/:id", adminRequired, updateUser);

router.get("/teams", adminRequired, listTeams);
router.delete("/teams/:id", adminRequired, deleteTeam);
router.patch("/teams/:id", adminRequired, updateTeam);

router.get("/weights", adminRequired, listWeights);
router.delete("/weights/:id", adminRequired, deleteWeight);
router.patch("/weights/:id", adminRequired, updateWeight);

router.get("/challenges", adminRequired, listChallenges);
router.post("/challenges", adminRequired, createChallenge);
router.delete("/challenges/:id", adminRequired, deleteChallenge);
router.patch("/challenges/:id", adminRequired, updateChallenge);

router.get("/articles", adminRequired, listArticles);
router.post("/articles", adminRequired, createArticle);
router.delete("/articles/:id", adminRequired, deleteArticle);
router.patch("/articles/:id", adminRequired, updateArticle);

module.exports = router;
