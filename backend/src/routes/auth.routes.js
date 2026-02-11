const express = require("express");
const { adminRequired } = require("../middleware/admin");
const { wxLogin, devLogin } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/wx-login", wxLogin);
router.post("/dev-login", adminRequired, devLogin);

module.exports = router;
