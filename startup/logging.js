const winston = require("winston");

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename: "./logs/combined.log",
        }),
        new winston.transports.File({
            filename: "./logs/errors.log",
            level: "error",
        }),
        new winston.transports.File({
            filename: "./logs/unhandled.log",
            level: "error",
            handleExceptions: true,
            handleRejections: true,
        }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

module.exports = logger;
