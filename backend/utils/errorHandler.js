const { logError } = require("./logger");

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Unexpected server error";
  logError("request_error", {
    status,
    message,
    path: req.originalUrl,
    stack: err.stack
  });

  res.status(status).json({
    error: message
  });
};

module.exports = errorHandler;
