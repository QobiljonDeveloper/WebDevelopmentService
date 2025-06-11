const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, colorize } = format;

const logDir = path.join(__dirname, "..", "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const myFormat = printf(({ level, message, timestamp, label }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    label({ label: "WebDevelopmentService" }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    myFormat
  ),
  transports: [
    new transports.Console({
      level: "debug",
      format: combine(colorize(), myFormat),
    }),

    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(logDir, "info.log"),
      level: "info",
    }),
  ],

  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, "exceptions.log") }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, "rejections.log") }),
  ],
});

module.exports = logger;
