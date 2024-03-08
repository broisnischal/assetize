export const logger = {
  error(...args: unknown[]) {
    console.error(...args);
  },
  warn(...args: unknown[]) {
    console.warn(...args);
  },
  info(...args: unknown[]) {
    console.info(...args);
  },
  success(...args: unknown[]) {
    console.info(...args);
  },
};
