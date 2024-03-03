// import { AssetizeConfig, defineAssetizeConfig } from "./";

import _ from "lodash";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import type { AssetizeConfig } from "../config/assetize.config";

export async function loadUserConfig(): Promise<AssetizeConfig> {
  const rootDir = process.cwd(); // Get the root directory of the user's project

  const configPath = path.join(rootDir, "assetize.config.ts");

  let config: AssetizeConfig;

  try {
    // Dynamically import the user's configuration file
    const userConfigModule = await import(configPath);

    config = userConfigModule.default || userConfigModule; // Handle ES6 default exports
  } catch (error) {
    console.error("Error loading user configuration:", error);
    config = {
      outputFile: "gen.ts",
      codebase: "remix",
    }; // Fallback to default configuration
  }

  return config;
}

async function main() {
  const userConfig = await loadUserConfig();
  console.log(userConfig);
}

main().catch(console.error);

// let userConfig = import("../../assetize.config");

// async function main() {
//   const config = await userConfig;
//   console.log(config);
// }

// main().catch(console.error);
