const jwt = require("jsonwebtoken");
const { getEnv } = require("../config/env");

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Missing token" },
    });
  }

  try {
    const env = getEnv();
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.sub, openid: payload.openid };
    return next();
  } catch {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid token" },
    });
  }
}

module.exports = { authRequired };
