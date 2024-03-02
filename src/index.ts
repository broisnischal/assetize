#!/usr/bin/env node

import { Generator } from "./utils";

async function main() {
  console.clear();

  const generator = new Generator("./assets", ".");

  generator.generateAssetsFile("./assets");
}

main().catch(console.error);
