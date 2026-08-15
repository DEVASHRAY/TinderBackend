type LogLevel = 'success' | 'fail' | 'warn' | 'info' | 'debug';

interface PaintInput {
  color: string;
  text: string;
}

interface FormatLogInput {
  level: LogLevel;
  message: string;
  detail: string | null;
}

interface LogInput {
  level: LogLevel;
  message: string;
  detail?: string | null;
}

export interface LoggerMessageInput {
  message: string;
  detail?: string | null;
}

export interface ErrorDetailInput {
  error: Error;
}

const iconByLevel: Record<LogLevel, string> = {
  success: '✅',
  fail: '❌',
  warn: '⚠️',
  info: 'ℹ️',
  debug: '🔎',
};

const labelByLevel: Record<LogLevel, string> = {
  success: 'PASS',
  fail: 'FAIL',
  warn: 'WARN',
  info: 'INFO',
  debug: 'DEBUG',
};

// These are terminal color codes, not CSS. They tell the terminal "print this in green/red/…".
// `\u001b` is the Escape character; `[0m` means "go back to normal text".
const colorByLevel: Record<LogLevel, string> = {
  success: '\u001b[32m',
  fail: '\u001b[31m',
  warn: '\u001b[33m',
  info: '\u001b[36m',
  debug: '\u001b[90m',
};

const reset = '\u001b[0m';
const dim = '\u001b[2m';

const paint = ({ color, text }: PaintInput): string => {
  // `process.stdout` is this program's output stream (like `console`, but the raw pipe).
  // `isTTY` means "are we printing to a real terminal?". If logs go to a file/CI, skip colors.
  if (!process.stdout.isTTY) {
    return text;
  }

  return `${color}${text}${reset}`;
};

const timestamp = (): string => new Date().toISOString();

const formatLog = ({ level, message, detail }: FormatLogInput): string => {
  const header = `${iconByLevel[level]}  ${labelByLevel[level].padEnd(5)}  ${paint({ color: dim, text: timestamp() })}`;
  const title = paint({ color: colorByLevel[level], text: header });
  const body = `    ${message}`;

  if (detail === null) {
    return `${title}\n${body}`;
  }

  return `${title}\n${body}\n${paint({ color: dim, text: `    ${detail}` })}`;
};

const write = ({ level, message, detail }: FormatLogInput): void => {
  const formatted = formatLog({ level, message, detail });

  if (level === 'fail') {
    console.error(formatted);
    return;
  }

  if (level === 'warn') {
    console.warn(formatted);
    return;
  }

  console.log(formatted);
};

const log = ({ level, message, detail = null }: LogInput): void => {
  write({ level, message, detail });
};

export const logger = {
  success: ({ message, detail = null }: LoggerMessageInput): void => {
    log({ level: 'success', message, detail });
  },
  fail: ({ message, detail = null }: LoggerMessageInput): void => {
    log({ level: 'fail', message, detail });
  },
  warn: ({ message, detail = null }: LoggerMessageInput): void => {
    log({ level: 'warn', message, detail });
  },
  info: ({ message, detail = null }: LoggerMessageInput): void => {
    log({ level: 'info', message, detail });
  },
  debug: ({ message, detail = null }: LoggerMessageInput): void => {
    log({ level: 'debug', message, detail });
  },
};

export const errorDetail = ({ error }: ErrorDetailInput): string => {
  if (error.stack === undefined) {
    return error.message;
  }

  return error.stack;
};
