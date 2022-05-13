import * as winston from 'winston';

export const loggerConsole = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    winston.format.colorize(),
    winston.format.json(),
    winston.format.printf(({ level, message, context, timestamp }) => {
      return `${timestamp} [${context}] ${level}: ${message}`;
    }),
  ),
});
export const loggerFile = new winston.transports.DailyRotateFile({
  level: 'error',
  dirname: 'logs',
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD', //-HH
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(({ level, message, timestamp, status, stack }) => {
      return `${timestamp} [${status}] ${level}: ${message}\n\t ${stack} \r\n`;
    }),
  ),
});
