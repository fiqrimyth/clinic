const winston = require("winston");
const path = require("path");

// Format log yang lebih readable
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(metadata).length ? JSON.stringify(metadata) : ""
    }`;
  })
);

// Buat logger
const logger = winston.createLogger({
  level: "info",
  format: customFormat,
  transports: [
    // Simpan log error ke file error.log
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),
    // Simpan semua log ke user-activity.log
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/user-activity.log"),
    }),
    // Tampilkan di console saat development
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

module.exports = logger;
