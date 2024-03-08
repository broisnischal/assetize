import { Command } from "commander";
import { logger } from "../utils/logger";
import { generateConfigFile } from "../main";
import { addScriptToPackageJSON } from "../utils";

export const generate = new Command()
  .name("generate")
  .description("Generate config file for assetize.")
  .action(async () => {
    await generateConfigFile().catch(console.error);

    addScriptToPackageJSON("assetize:build", "npx assetize build");

    logger.success("Success: assetize config generated!");
  });
