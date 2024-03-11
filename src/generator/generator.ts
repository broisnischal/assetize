import _ from "lodash";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { defaultConfigOptions, getConfig, getOutputFileType } from "../config";
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

export async function createAssetItem() {
  const fileType = await getOutputFileType();

  if (fileType === "ts") {
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
  } else if (fileType === "js") {
    return `
/// GENERATED CODE - DO NOT MODIFY BY HAND
/// *****************************************************
///  Assetize Generator - DO NOT CHANGE
/// *****************************************************

class AssetItem {
  constructor(assetName) {
    this._assetName = assetName;
    this._keyName = assetName.split("/").pop().split(".")[0] || assetName;
    this._ext = assetName.split(".").pop();
    this._altText = this._keyName + " " + " image";
  }

  get keyName() {
    return this._keyName;
  }

  get path() {
    return this._assetName;
  }

  get ext() {
    return this._ext;
  }

  get altText() {
    return this._altText;
  }
}
    `;
  } else {
    throw new Error("File type not supported");
  }
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

  const fileType = await getOutputFileType();

  if (fileType === "ts") {
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
  } else if (fileType === "js") {
    return `
    class ${config.className ?? defaultConfigOptions.className} {
      constructor() {}

      // private static instance: ${config.className ?? defaultConfigOptions.className};

      static get ${convertCase("root", config.case)}() {
        return AssetRootGen;
      }
      static get ${convertCase("icons", config.case)}() {
        return AssetsIconsGen;
      }
      static get ${convertCase("images", config.case)}() {
        return AssetsImagesGen;
      }
      static get ${convertCase("fonts", config.case)}() {
        return AssetsFontsGen;
      }
    }
    `;
  } else {
    throw new Error("Invalid file type");
  }
}

// ${convertCase(
//   mainRoute.split("/").pop() ?? "AssetsRoot",
//   config.case,
// )};

export async function generateFile() {
  try {
    const config = await getConfig();
    const fileType = await getOutputFileType();

    const outputPath = path.join(
      config.output ?? defaultConfigOptions.output,
      config.outputFile ?? defaultConfigOptions.outputFile,
    );

    // if (!fs.existsSync(outputPath)) {
    //   fs.writeFileSync(outputPath, "");
    // }

    const generatedCode = `
        ${await createAssetItem()}
        ${await createClassRootAssetsDir()}
        ${await createClassIconsGen()}
        ${await createClassImageGen()}
        ${await createClassFontGen()}
        ${await createMainClassAndExport()}
        `;

    const formattedCode = await prettier.format(generatedCode, {
      parser: fileType === "ts" ? "typescript" : "babel",
    });

    fs.writeFileSync(outputPath, formattedCode);
  } catch (error) {
    logger.error(error);
    process.exit(0);
  }
}

// generateFile();
