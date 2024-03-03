#!/usr/bin/env node

// import { Generator } from "./utils";

import { loadUserConfig } from "./generator/generator";

async function main() {
  console.clear();

  const userConfig = loadUserConfig();
  console.log(userConfig);
  // const generator = new Generator("./assets", ".");

  // generator.generateAssetsFile("./assets");
}

main().catch(console.error);
