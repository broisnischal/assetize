import _ from "lodash";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { getConfig } from "../config/get-config";
import { getCodebase } from "../utils";

export async function getFileContents() {
  const config = await getConfig();

  const { codebase } = config;

  const assetsDirectory = config.assets?.path;
  const file = config.outputFile!;

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

export function createClassSvgGen() {
  return `class AssetsSvgsGen {
    constructor() {}

    private static instance: AssetsSvgsGen;

    /// FILEP path : assets/icons/Genetic.svg
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

    static readonly icons = AssetsSvgsGen;
    static readonly images = AssetsImagesGen;
    static readonly fonts = AssetsFontsGen;
  }

  export default MyAssets;
  `;
}

async function main() {
  const config = await getConfig();

  const outputPath = path.join(config.output!, config.outputFile!);

  const generatedCode = `
  ${createAssetItem()}
  ${createClassSvgGen()}
  ${createClassImageGen()}
  ${createClassFontGen()}
  ${createMainClassAndExport()}
  `;

  const formattedCode = await prettier.format(generatedCode, {
    parser: "typescript",
  });

  fs.writeFileSync(outputPath, formattedCode);

  console.log(await getCodebase());
}

main();
