const expressWinston = require("express-winston");
const logger = require("../../services/logger.service");

module.exports = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: () => false,
});
