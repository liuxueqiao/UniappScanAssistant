const express = require("express");
const { authRequired } = require("../middleware/auth");
const { getMe, updateProfile } = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authRequired, getMe);
router.patch("/me", authRequired, updateProfile);

module.exports = router;

