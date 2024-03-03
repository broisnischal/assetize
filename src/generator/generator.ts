// import { AssetizeConfig, defineAssetizeConfig } from "./";

import _ from "lodash";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import type { AssetizeConfig } from "../config/assetize.config";
import { cosmiconfig } from "cosmiconfig";

// const explorer = cosmiconfig("assetize");
// console.log(explorer.search());

// export async function loadUserConfig() {
// const rootDir = process.cwd(); // Get the root directory of the user's project

// console.log(rootDir);

// const configPath = path.join(rootDir, "assetize.config.js");

// console.log(configPath);

// let config: AssetizeConfig;

// try {
//   // Dynamically import the user's configuration file
//   const userConfigModule = await import(configPath);

//   config = userConfigModule.default || userConfigModule; // Handle ES6 default exports
// } catch (error) {
//   console.error("Error loading user configuration:", error);
//   config = {
//     outputFile: "gen.ts",
//     codebase: "remix",
//   }; // Fallback to default configuration
// }j

// return config;

//   console.log("testing");
//   const explorer = cosmiconfig("assetize");
//   console.log(explorer.load(process.cwd()));
// }

// async function main() {
//   const userConfig = await loadUserConfig();
//   console.log(userConfig);
// }

// main().catch(console.error);

// let userConfig = import("../../assetize.config");

// async function main() {
//   const config = await userConfig;
//   console.log(config);
// }

// main().catch(console.error);

export async function loadConfig(cwd = process.cwd(), configPath: string) {
  const explorer = cosmiconfig("assetize");

  const explicitPath = configPath ? path.resolve(cwd, configPath) : undefined;
  const explore = explicitPath ? explorer.load : explorer.search;
  const searchPath = explicitPath ? explicitPath : cwd;
  const local = await explore(searchPath);

  if (local) {
    return local;
  }

  return {};
}
