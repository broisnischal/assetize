#! /usr/bin/env node

import { askInstall } from "./main";

async function main() {
  await askInstall();
}

main();
