const formatTimestamp = () => new Date().toISOString();

const logInfo = (message, meta = {}) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  console.log(`[INFO] ${formatTimestamp()} ${message}${metaString}`);
};

const logWarn = (message, meta = {}) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  console.warn(`[WARN] ${formatTimestamp()} ${message}${metaString}`);
};

const logError = (message, meta = {}) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  console.error(`[ERROR] ${formatTimestamp()} ${message}${metaString}`);
};

const requestLogger = () => (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - start;
    logInfo("request", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs
    });
  });
  next();
};

module.exports = {
  logInfo,
  logWarn,
  logError,
  requestLogger
};
