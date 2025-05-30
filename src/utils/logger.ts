/**
 * Production-ready logging utility
 * Provides structured logging with different levels and environment-aware output
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string | undefined;
  data?: unknown;
}

class Logger {
  private readonly isDevelopment: boolean;
  private readonly logLevel: LogLevel;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  /**
   * Log an error message
   */
  error(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.ERROR, message, data, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  /**
   * Log an info message (development only)
   */
  info(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  /**
   * Log a debug message (development only)
   */
  debug(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, data?: unknown, context?: string | undefined): void {
    if (level > this.logLevel) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      data,
    };

    if (this.isDevelopment) {
      this.logToConsole(entry);
    } else {
      // In production, you might want to send logs to a service
      this.logToService(entry);
    }
  }

  /**
   * Log to console (development)
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp.toISOString()}]`;
    const contextStr = entry.context ? ` [${entry.context}]` : '';
    const fullMessage = `${prefix}${contextStr} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(fullMessage, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage, entry.data);
        break;
      case LogLevel.INFO:
        console.info(fullMessage, entry.data);
        break;
      case LogLevel.DEBUG:
        console.debug(fullMessage, entry.data);
        break;
    }
  }

  /**
   * Log to external service (production)
   */
  private logToService(entry: LogEntry): void {
    // In production, you would send critical logs to a logging service
    // For now, we'll only log errors and warnings to console
    if (entry.level <= LogLevel.WARN) {
      this.logToConsole(entry);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Performance timing utility
 */
export class PerformanceTimer {
  private readonly startTime: number;
  private readonly label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = performance.now();
    logger.debug(`Performance timer started: ${label}`);
  }

  /**
   * End the timer and log the duration
   */
  end(): number {
    const duration = performance.now() - this.startTime;
    logger.debug(`Performance timer ended: ${this.label} took ${duration.toFixed(2)}ms`);
    return duration;
  }
}

/**
 * Create a performance timer
 */
export const createTimer = (label: string): PerformanceTimer => {
  return new PerformanceTimer(label);
};
