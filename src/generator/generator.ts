import _ from "lodash";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { defaultConfigOptions, getConfig } from "../config";
// import { getCodebase } from "../utils";
import { logger } from "../utils/logger";
import { Config } from "../config";
import { convertCase, generatePublicPath, normalizeString } from "../utils";
import { AssetClassBuilder } from "./builder";

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
  private _ext: string;
  private _altText: string;

  constructor(assetName: string) {
    this._assetName = assetName;
    this._keyName = assetName.split("/").pop()?.split(".")[0]! || assetName;
    this._ext = assetName.split(".").pop()!;
    this._altText = this._keyName + " " + " image";
  }

  get keyName() {
    return this._keyName;
  }

  get path() {
    return this._assetName;
  }

  get ext(){
    return this._ext;
  }

  get altText() {
    return this._altText;
  }
}`;
}

export async function createClassRootAssetsDir() {
  const config = await getConfig();

  const mainRoute = path.join(
    config.assets?.path ?? defaultConfigOptions.assets.path,
  );

  const builder = new AssetClassBuilder("AssetRootGen", mainRoute, config);

  return builder.generateClassCode();
}

export async function createClassIconsGen() {
  const config = await getConfig();

  const mainRoute = path.join(
    config.assets?.path ?? defaultConfigOptions.assets.path,
    config.assets?.integrations?.icons?.path ??
      defaultConfigOptions.assets.integrations.icons.path,
  );

  const builder = new AssetClassBuilder(
    "AssetsIconsGen",
    mainRoute,
    config,
    "icons",
  );

  return builder.generateClassCode();
}

export async function createClassImageGen() {
  const config = await getConfig();

  const mainRoute = path.join(
    config.assets?.path ?? defaultConfigOptions.assets.path,
    config.assets?.integrations?.images?.path ??
      defaultConfigOptions.assets.integrations.images.path,
  );

  const builder = new AssetClassBuilder(
    "AssetsImagesGen",
    mainRoute,
    config,
    "images",
  );

  return builder.generateClassCode();
}

export async function createClassFontGen() {
  const config = await getConfig();

  const mainRoute = path.join(
    config.assets?.path ?? defaultConfigOptions.assets.path,
    config.assets?.integrations?.fonts?.path ??
      defaultConfigOptions.assets.integrations.fonts?.path,
  );

  const builder = new AssetClassBuilder(
    "AssetsFontsGen",
    mainRoute,
    config,
    "fonts",
  );

  return builder.generateClassCode();
}

export async function createMainClassAndExport() {
  const config = await getConfig();

  return `
  class ${config.className ?? defaultConfigOptions.className} {
    private constructor() {}

    // private static instance: ${config.className ?? defaultConfigOptions.className};

    static readonly ${convertCase("root", config.case)} = AssetRootGen;
    static readonly ${convertCase("icons", config.case)} = AssetsIconsGen;
    static readonly ${convertCase("images", config.case)} = AssetsImagesGen;
    static readonly ${convertCase("fonts", config.case)} = AssetsFontsGen;
  }

  export default ${config.className ?? defaultConfigOptions.className};
  `;
}

// ${convertCase(
//   mainRoute.split("/").pop() ?? "AssetsRoot",
//   config.case,
// )};

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
        ${await createClassRootAssetsDir()}
        ${await createClassIconsGen()}
        ${await createClassImageGen()}
        ${await createClassFontGen()}
        ${await createMainClassAndExport()}
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
