function notFoundHandler(req, res, _next) {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
}

function errorHandler(err, req, res, _next) {
  const status = Number(err.status || 500);
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Internal server error";

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: { code, message },
  });
}

module.exports = { notFoundHandler, errorHandler };
