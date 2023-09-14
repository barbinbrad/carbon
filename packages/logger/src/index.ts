export class Logger {
  name: string;

  constructor(name = "default") {
    this.name = name;
  }

  log(
    level: "log" | "trace" | "warn" | "info" | "debug" | "error" = "log",
    ...args: any[]
  ) {
    console[level](`%c[${this.name}]`, `color: blue;`, ...args);
  }

  trace(...args: any[]) {
    this.log("trace", ...args);
  }

  warn(...args: any[]) {
    this.log("warn", ...args);
  }

  info(...args: any[]) {
    this.log("info", ...args);
  }

  debug(...args: any[]) {
    this.log("debug", ...args);
  }

  error(...args: any[]) {
    this.log("error", ...args);
  }
}

export default {
  create: (name?: string) => new Logger(name),
};
