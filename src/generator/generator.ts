import _ from "lodash";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { defaultConfigOptions, getConfig } from "../config";
// import { getCodebase } from "../utils";
import { logger } from "../utils/logger";

export async function getFileContents() {
  const config = await getConfig();

  const assetsDirectory =
    config.assets?.path ?? defaultConfigOptions.assets.path;
  const file = config.outputFile ?? defaultConfigOptions.outputFile;

  if (!fs.existsSync(assetsDirectory!)) {
    throw new Error(`Directory ${assetsDirectory} does not exist`);
  }

  try {
    console.log(path.join(config.output!, file));

    const fileContents = fs
      .readFileSync(path.join(config.output!, file))
      .toString();

    return fileContents;
  } catch (error) {
    // No file
    console.log(error);
    return null;
  }
}

export function createAssetItem() {
  return `
/// GENERATED CODE - DO NOT MODIFY BY HAND
/// *****************************************************
///  Assetize Generator - DO NOT CHANGE
/// *****************************************************

class AssetItem {
  private _assetName: string;
  private _keyName: string;

  constructor(assetName: string) {
    this._assetName = assetName;
    this._keyName = assetName.split("/").pop()?.split(".")[0]! || assetName;
  }

  get keyName() {
    return this._keyName;
  }

  get path() {
    return this._assetName;
  }
}`;
}

export async function createClassSvgGen() {
  const config = await getConfig();

  const mainRoute = path.join(
    config.assets?.path ?? defaultConfigOptions.assets.path,
    config.assets?.integrations?.icons?.path ??
      defaultConfigOptions.assets.integrations.icons.path,
  );

  const files = fs.readdirSync(mainRoute, {
    recursive: true,
    withFileTypes: true,
  });

  console.log(files);

  return `class AssetsIconsGen {
    constructor() {}

    private static instance: AssetsIconsGen;

    /// FILE path : assets/icons/Genetic.svg
    static readonly Genetic: AssetItem = new AssetItem(
      "./assets/icons/Genetic.svg",
    );
    static readonly button: AssetItem = new AssetItem(
      "./assets/icons/button.svg",
    );

    static get icons() {
      return [this.Genetic, this.button];
    }
  }`;
}

export function createClassImageGen() {
  return `class AssetsImagesGen {
    constructor() {}

    private static instance: AssetsImagesGen;

    static readonly Genetic: AssetItem = new AssetItem(
      "./assets/images/Genetic.jpg",
    );
    static readonly ButtonImage: AssetItem = new AssetItem(
      "./assets/images/button.png",
    );

    static get images() {
      return [this.Genetic, this.ButtonImage];
    }
  }`;
}

export function createClassFontGen() {
  return `
  class AssetsFontsGen {
    constructor() {}

    private static instance: AssetsFontsGen;

    static readonly Genetic: AssetItem = new AssetItem(
      "./assets/fonts/Genetic.ttf",
    );

    static get fonts() {
      return [this.Genetic];
    }
  }
  `;
}

export function createMainClassAndExport() {
  return `
  class MyAssets {
    private constructor() {}

    static readonly icons = AssetsIconsGen;
    static readonly images = AssetsImagesGen;
    static readonly fonts = AssetsFontsGen;
  }

  export default MyAssets;
  `;
}

export async function generateFile() {
  try {
    const config = await getConfig();

    const outputPath = path.join(
      config.output ?? defaultConfigOptions.output,
      config.outputFile ?? defaultConfigOptions.outputFile,
    );

    // if (!fs.existsSync(outputPath)) {
    //   fs.writeFileSync(outputPath, "");
    // }

    const generatedCode = `
        ${createAssetItem()}
        ${await createClassSvgGen()}
        ${createClassImageGen()}
        ${createClassFontGen()}
        ${createMainClassAndExport()}
        `;

    const formattedCode = await prettier.format(generatedCode, {
      parser: "typescript",
    });

    fs.writeFileSync(outputPath, formattedCode);
  } catch (error) {
    logger.error(error);
    process.exit(0);
  }
}

// generateFile();
