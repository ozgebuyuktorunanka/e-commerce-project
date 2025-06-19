import winston, { format } from 'winston';
import { TransformableInfo } from 'logform';

/**
 * The function `formatTurkishDate` converts a timestamp to a formatted date string in Turkish time
 * zone with specific display options.
 * @param timestamp - The `timestamp` parameter is the date and time value that you want to format into
 * a Turkish date format. It can be a Unix timestamp (number of milliseconds since January 1, 1970) or
 * a string representing a date/time in a format that JavaScript `Date` constructor can parse.
 * @returns The function `formatTurkishDate` takes a timestamp as input, converts it to a date object,
 * and then formats the date and time according to Turkish standards. The returned value is a string
 * representing the formatted date and time in the format "dd/mm/yyyy, hh:mm:ss" in the timezone of
 * Europe/Istanbul with a 24-hour clock.
 */
function formatTurkishDate(timestamp: string | number): string {
    return new Date(timestamp).toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul', // Time zone for Turkey time
        hour12: false, // 24-hour clock format
        hour: '2-digit', // Show time in two digits
        minute: '2-digit', // Show minute in two digits
        second: '2-digit', // Show seconds in two digits
        year: 'numeric', // Show year in four digits
        month: '2-digit', // Show month in two digits
        day: '2-digit', // Show day in two digits
    });
}

/**
 * The function `styleLevel` takes a level as input and returns a styled version of the level based on
 * the input, with different styles for 'info', 'warn', 'error', and 'debug' levels.
 * @param level - The `styleLevel` function takes a `level` parameter and returns a styled version of
 * the input based on the specified cases. The styling includes color and text formatting using ANSI
 * escape codes.
 * @returns The function `styleLevel` takes a `level` parameter and returns a styled version of the
 * input based on the following conditions:
 * - If the `level` is 'info', it returns the input in bold, cyan color, and upper case.
 * - If the `level` is 'warn', it returns the input in bold, yellow color (closest to orange), and
 * upper case.
 */
function styleLevel(level: string): string {
    switch (level) {
        case 'info':
            return `ℹ️-\u001b[1m\u001b[36m${level.toUpperCase()}\u001b[39m\u001b[22m`; // Bold, cyan, and upper case
        case 'warn':
            return `⚠️-\u001b[1m\u001b[33m${level.toUpperCase()}\u001b[39m\u001b[22m`; // Bold, yellow (closest to orange), and upper case
        case 'error':
            return `❌-\u001b[1m\u001b[31m${level.toUpperCase()}\u001b[39m\u001b[22m`; // Bold, red, and upper case
        case 'debug':
            return `🔍-\u001b[1m\u001b[31m${level.toUpperCase()}\u001b[39m\u001b[22m`; // Bold, red, and upper case
        default:
            return level.toUpperCase(); // Upper case for other levels
    }
}
/**
 * The function `commonFormat` takes an object with `level`, `message`, and `timestamp` properties,
 * formats the timestamp into a Turkish date, styles the level, and returns a formatted string with the
 * level, date, and message.
 * @returns The function `commonFormat` is returning a formatted string that includes the styled level,
 * Turkish date, and message enclosed in square brackets and separated by dashes.
 */
function commonFormat(info: TransformableInfo): string {
    const { level, message, timestamp } = info;

    const turkishDate = formatTurkishDate(timestamp as string);
    const styledLevel = styleLevel(level);
    return `[${styledLevel}] [${turkishDate}] 📝 ${message}`;
}
/* The `const loggerTransport` declaration is creating a new transport object for logging messages to
the console using the `winston` logging library in JavaScript. */
const loggerTransport = new winston.transports.Console({
    format: format.combine(
        format.timestamp(),
        format.printf(commonFormat)
    )
});
/* This section of code is defining the configuration options for the logger. It specifies the
transports that the logger will use to handle log messages. In this case, there are two transports
configured: */
// Logger configuration
const options: winston.LoggerOptions = {
    transports: [
        loggerTransport,
        new winston.transports.File({
            filename: 'logs/all.log', // File to log all levels
            maxsize: 10485760, // 10 MB
            maxFiles: 5,
            format: format.combine(
                format.timestamp(),
                format.printf(commonFormat)
            )
        })
    ]
};
// Create the logger
const logger = winston.createLogger(options);
export default logger;
