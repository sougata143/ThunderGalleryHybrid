type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  tag?: string;
  errorCode?: string;
  data?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = __DEV__;

  info(message: string, data?: LogData) {
    this.log('info', message, data);
  }

  warn(message: string, data?: LogData) {
    this.log('warn', message, data);
  }

  error(message: string, data?: LogData) {
    this.log('error', message, data);
  }

  debug(message: string, data?: LogData) {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }

  group(label: string) {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  groupEnd() {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  private log(level: LogLevel, message: string, data?: LogData) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...data,
    };

    switch (level) {
      case 'error':
        console.error(JSON.stringify(logData, null, 2));
        break;
      case 'warn':
        console.warn(JSON.stringify(logData, null, 2));
        break;
      case 'debug':
        console.debug(JSON.stringify(logData, null, 2));
        break;
      default:
        console.log(JSON.stringify(logData, null, 2));
    }
  }
}

const logger = new Logger();
export default logger;
