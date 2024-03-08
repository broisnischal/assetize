import { Command } from "commander";
import { logger } from "../utils/logger";
import { generateFile } from "../generator/generator";

export const build = new Command()
  .name("build")
  .description("assetize: build the assets generator file.")
  .action(async () => {
    await generateFile().catch((err) => {
      logger.error(err);
    });

    logger.info(`Success build file`);

    process.exit(1);
  });
