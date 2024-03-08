import { Command } from "commander";
import { logger } from "../utils/logger";
import { createAssetsDirectory } from "../utils";
import { getConfig } from "../config";
// import { execa } from "execa";

export const init = new Command()
  .name("init")
  .description("initialize your project and choose libraries")
  .action(async () => {
    const config = await getConfig();
    await createAssetsDirectory(config.assets?.path);
    // await $`npm install assetize`;

    logger.info(`Success : Project initialization completed.`);
  });
