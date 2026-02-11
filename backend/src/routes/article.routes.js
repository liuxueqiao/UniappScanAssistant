const express = require("express");
const { adminRequired } = require("../middleware/admin");
const { listLatest, getById, adminCreate, adminUpdate } = require("../controllers/article.controller");

const router = express.Router();

router.get("/latest", listLatest);
router.get("/:id", getById);

router.post("/", adminRequired, adminCreate);
router.patch("/:id", adminRequired, adminUpdate);

module.exports = router;

