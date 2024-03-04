import _ from "lodash";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { getConfig } from "../config/get-config";

export async function getFileContents() {
  const config = await getConfig();

  const { codebase } = config;

  const assetsDirectory = config.mainAssetPath ?? "assets";
  const file = config.outputFile;

  if (!fs.existsSync(assetsDirectory)) {
    throw new Error(`Directory ${assetsDirectory} does not exist`);
  }

  try {
    console.log(path.join(config.output, file));

    const fileContents = fs
      .readFileSync(path.join(config.output, file))
      .toString();

    return fileContents;
  } catch (error) {
    // No file
    return null;
  }
}
