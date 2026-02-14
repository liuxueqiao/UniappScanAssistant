const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const { notFoundHandler, errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const weightRoutes = require("./routes/weight.routes");
const teamRoutes = require("./routes/team.routes");
const challengeRoutes = require("./routes/challenge.routes");
const articleRoutes = require("./routes/article.routes");
const cosRoutes = require("./routes/cos.routes");
const adminRoutes = require("./routes/admin.routes");

function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("tiny"));

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/weights", weightRoutes);
  app.use("/api/teams", teamRoutes);
  app.use("/api/challenges", challengeRoutes);
  app.use("/api/articles", articleRoutes);
  app.use("/api/cos", cosRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/admin", express.static(path.join(__dirname, "public/admin")));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
