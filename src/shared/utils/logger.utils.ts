import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
};

const colors = {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize({ all: true }),
      winston.format.printf(({ timestamp, message, module, systemMessage, level }) => {
            return `[${timestamp}] [${level}] [${module}] [${systemMessage}] ${message}`;
      }),
);

const transports = new DailyRotateFile({
      filename: 'logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format,
      level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
});

const consoleTransport = new winston.transports.Console({
      format,
});

const logger = winston.createLogger({
      level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
      levels,
      format,
      transports: [consoleTransport, transports],
});

export default logger;