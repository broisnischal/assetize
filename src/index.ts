#!/usr/bin/env node

// import { Generator } from "./utils";

import { getFileContents } from "./generator/generator";
import { addScriptToPackageJSON, getPackageJSON } from "./utils";

// import { loadConfig } from "./generator/generator";

async function main() {
  console.clear();

  // try {
  //   const userConfig = await loadConfig();
  //   console.log(userConfig);
  // } catch (error) {
  //   console.log("no file matched");
  // }
  // const generator = new Generator("./assets", ".");

  // generator.generateAssetsFile("./assets");

  const packagae = getPackageJSON();
  console.log(packagae);

  addScriptToPackageJSON("assetize:build", "npx assetize build");

  console.log(await getFileContents());
}

main().catch(console.error);

export * from "./config/assetize.config";
export * from "./generator/generator";
