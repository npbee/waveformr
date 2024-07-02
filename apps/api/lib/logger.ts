import * as log from "@std/log";

log.setup({
  handlers: {
    console: new log.ConsoleHandler("DEBUG", {
      formatter: (record) => `[${record.levelName}] ${record.msg}`,
    }),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

export const logger = log.getLogger();
