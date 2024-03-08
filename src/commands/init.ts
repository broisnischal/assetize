import chalk from "chalk";
import { Command } from "commander";
import { logger } from "../logger";

export const init = new Command()
  .name("init")
  .description("initialize your project and choose libraries")
  .action(async () => {
    // await configureLibraries();

    logger.info(`${chalk.green("Success!")} Project initialization completed.`);
  });
