import chalk from "chalk";
import { Command } from "commander";
import { logger } from "../utils/logger";
import { generateAssetsFile } from "../generator/gen-func";
import { generateFile } from "../generator/generator";

export const build = new Command()
  .name("build")
  .description("assetize: build the assets generator file.")
  .action(async () => {
    await generateFile();

    logger.info(`${chalk.green("Success!")} build file`);

    process.exit(1);
  });
