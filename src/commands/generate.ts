import chalk from "chalk";
import { Command } from "commander";
import { logger } from "../logger";
import { generateConfigFile } from "../main";

export const init = new Command()
  .name("init")
  .description("initialize your project and choose libraries")
  .action(async () => {
    await generateConfigFile().catch(console.error);

    logger.success("Success: assetize config generated!");
  });
