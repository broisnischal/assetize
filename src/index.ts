#!/usr/bin/env node

import { Command } from "commander";
import { getFileContents } from "./generator/generator";
import { addScriptToPackageJSON, getPackageJSON } from "./utils";
import packageJSON from "../package.json" with { type: "json" };
import { init } from "./commands/generate";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

// async function main() {
//   console.clear();

//   // try {
//   //   const userConfig = await loadConfig();
//   //   console.log(userConfig);
//   // } catch (error) {
//   //   console.log("no file matched");
//   // }
//   // const generator = new Generator("./assets", ".");

//   // generator.generateAssetsFile("./assets");

//   const packagae = getPackageJSON();
//   console.log(packagae);

//   addScriptToPackageJSON("assetize:build", "npx assetize build");

//   console.log(await getFileContents());
// }

// main().catch(console.error);

const program = new Command()
  .name("assetize")
  .description("generates the assets class file for your project")
  .version(packageJSON.version, "-v, --version", "display the version number");

program.addCommand(init);

program.parse();

// export * from "./config/assetize.config";
// export * from "./generator/generator";
