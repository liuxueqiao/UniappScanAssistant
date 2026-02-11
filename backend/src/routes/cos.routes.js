const express = require("express");
const { authRequired } = require("../middleware/auth");
const { getStsCredential } = require("../controllers/cos.controller");

const router = express.Router();

router.get("/sts", authRequired, getStsCredential);

module.exports = router;

