const path = require("path");
const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { combine, timestamp, printf, colorize, errors } = format;
const {
  directories: { rootLogsDir },
} = require("./config");

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] => ${stack || message}`;
});

const dailyLogPath = path.join(rootLogsDir, "sarla-%DATE%.log");
const dailyErrorLogPath = path.join(
  rootLogsDir,
  "errors",
  "error-sarla-%DATE%.log"
);

const logger = createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: dailyLogPath,
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d", // keep logs for 14 days
      zippedArchive: true, // compress older files
    }),
    new DailyRotateFile({
      filename: dailyErrorLogPath,
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "14d", // keep logs for 14 days
      zippedArchive: true, // compress older files
    }),
    // new transports.File({ filename: errorLogPath, level: "error" }),
    // new transports.File({ filename: combinedLogPath }),
  ],
});

module.exports = logger;
