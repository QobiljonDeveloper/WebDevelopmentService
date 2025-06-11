const expressWinston = require("express-winston");
const logger = require("../../services/logger.service");

module.exports = expressWinston.errorLogger({
  winstonInstance: logger,
  msg: "ERROR {{req.method}} {{req.url}} -> {{err.message}}",
  meta: true,
  expressFormat: true,
  colorize: false,
  ignoreRoute: () => false,
});
