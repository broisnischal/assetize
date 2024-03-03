#!/usr/bin/env node

// import { Generator } from "./utils";

import { loadConfig } from "./generator/generator";

async function main() {
  console.clear();

  const userConfig = loadConfig(undefined, "./assetize.config.ts");
  console.log(userConfig);
  // const generator = new Generator("./assets", ".");

  // generator.generateAssetsFile("./assets");
}

main().catch(console.error);

export * from "./config/assetize.config";
export * from "./generator/generator";
