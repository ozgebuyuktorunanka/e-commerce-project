"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importStar(require("winston"));
function formatTurkishDate(timestamp) {
    return new Date(timestamp).toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}
function styleLevel(level) {
    switch (level) {
        case 'info':
            return `ℹ️-\u001b[1m\u001b[36m${level.toUpperCase()}\u001b[39m\u001b[22m`;
        case 'warn':
            return `⚠️-\u001b[1m\u001b[33m${level.toUpperCase()}\u001b[39m\u001b[22m`;
        case 'error':
            return `❌-\u001b[1m\u001b[31m${level.toUpperCase()}\u001b[39m\u001b[22m`;
        case 'debug':
            return `🔍-\u001b[1m\u001b[31m${level.toUpperCase()}\u001b[39m\u001b[22m`;
        default:
            return level.toUpperCase();
    }
}
function commonFormat(info) {
    const { level, message, timestamp } = info;
    const turkishDate = formatTurkishDate(timestamp);
    const styledLevel = styleLevel(level);
    return `[${styledLevel}] [${turkishDate}] 📝 ${message}`;
}
const loggerTransport = new winston_1.default.transports.Console({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(commonFormat))
});
const options = {
    transports: [
        loggerTransport,
        new winston_1.default.transports.File({
            filename: 'logs/all.log',
            maxsize: 10485760,
            maxFiles: 5,
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(commonFormat))
        })
    ]
};
const logger = winston_1.default.createLogger(options);
exports.default = logger;
//# sourceMappingURL=winston-logger.js.map