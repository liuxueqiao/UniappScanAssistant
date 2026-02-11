const { getEnv } = require("../config/env");

function adminRequired(req, res, next) {
  const env = getEnv();
  const key = req.headers["x-admin-key"];
  if (!key || key !== env.ADMIN_KEY) {
    return res.status(403).json({
      error: { code: "FORBIDDEN", message: "Admin only" }
    });
  }
  return next();
}

module.exports = { adminRequired };

