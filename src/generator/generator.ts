import _ from "lodash";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { defaultConfigOptions, getConfig } from "../config";
// import { getCodebase } from "../utils";
import { logger } from "../utils/logger";
import { Config } from "../config";
import { convertCase, generatePublicPath, normalizeString } from "../utils";

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

export async function createClassRootAssetsDir() {
  const config = await getConfig();

  const mainRoute = path.join(
    config.assets?.path ?? defaultConfigOptions.assets.path,
  );

  const files = fs.readdirSync(mainRoute).filter((file) => {
    const filePath = path.join(mainRoute, file);
    const stat = fs.statSync(filePath);
    return stat.isFile();
  });

  return `class AssetsRootGen {
    constructor() {}

    private static instance: AssetsRootGen;

    ${files
      .map((file) => {
        let name;

        const fileName = file.split(".")[0]; // Extract the filename without extension

        const checkIfSameNameExists = files.filter((file) => {
          const fileName = file.split(".")[0];
          return fileName === fileName;
        });

        if (checkIfSameNameExists.length > 1) {
          name = `${fileName}_${checkIfSameNameExists.length}`;
        } else {
          name = fileName;
        }

        const joinedPath = path.join(mainRoute, file);

        return `// ${fileName} - path : ${joinedPath}\nstatic readonly ${convertCase(name!, config.case)}: AssetItem = new AssetItem(
        "${generatePublicPath(joinedPath, config.codebase)}",
      );`;
      })
      .join("\n")}

    static get assets() {
      return [${files
        .map((file) => {
          let name;

          const fileName = file.split(".")[0]!;
          const checkIfSameNameExists = files.filter((file) => {
            const fileName = file.split(".")[0];
            return fileName === fileName;
          });

          if (checkIfSameNameExists.length > 1) {
            name = `${fileName}_${checkIfSameNameExists.length}`;
          } else {
            name = fileName;
          }

          return `this.${convertCase(name, config.case)}`;
        })
        .join(",")}];
    }
  }`;
}

export async function createClassIconsGen() {
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

  return `class AssetsIconsGen {
    constructor() {}

    private static instance: AssetsIconsGen;

    ${files
      .map((file) => {
        const fileName = file.name.split(".")[0]!;

        const joinedPath = path.join(mainRoute, file.name);

        return `// ${fileName} - path : ${joinedPath}\nstatic readonly ${convertCase(fileName, config.case)}: AssetItem = new AssetItem(
        "${generatePublicPath(joinedPath, config.codebase)}",
      );`;
      })
      .join("\n")}

    static get icons() {
      return [${files
        .map((file) => {
          const fileName = file.name.split(".")[0]!;
          return `this.${convertCase(fileName, config.case)}`;
        })
        .join(",")}];
    }
  }`;
}

export async function createClassImageGen() {
  const config = await getConfig();

  const mainRoute = path.join(
    config.assets?.path ?? defaultConfigOptions.assets.path,
    config.assets?.integrations?.images?.path ??
      defaultConfigOptions.assets.integrations.images.path,
  );

  const files = fs.readdirSync(mainRoute, {
    recursive: true,
    withFileTypes: true,
  });

  return `class AssetsImagesGen {
    constructor() {}

    private static instance: AssetsImagesGen;

    ${files
      .map((file) => {
        const fileName = file.name.split(".")[0]!;

        const joinedPath = path.join(mainRoute, file.name);

        return `static readonly ${convertCase(fileName, config.case)}: AssetItem = new AssetItem(
        "${generatePublicPath(joinedPath, config.codebase)}",
      );`;
      })
      .join("\n")}

      static get images() {
        return [${files
          .map((file) => {
            const fileName = file.name.split(".")[0]!;
            return `this.${convertCase(fileName, config.case)}`;
          })
          .join(",")}];
        }

  }`;
}

export async function createClassFontGen() {
  const config = await getConfig();

  const mainRoute = path.join(
    config.assets?.path ?? defaultConfigOptions.assets.path,
    config.assets?.integrations?.fonts?.path ??
      defaultConfigOptions.assets.integrations.fonts?.path,
  );

  const files = fs.readdirSync(mainRoute, {
    recursive: true,
    withFileTypes: true,
  });

  return `
  class AssetsFontsGen {
    constructor() {}

    private static instance: AssetsFontsGen;

    ${files
      .map((file) => {
        const fileName = file.name.split(".")[0]!;

        const joinedPath = path.join(mainRoute, file.name);

        return `// ${fileName} - path : ${joinedPath}\nstatic readonly ${convertCase(fileName, config.case)}: AssetItem = new AssetItem(
        "${generatePublicPath(joinedPath, config.codebase)}",
      );`;
      })
      .join("\n")}

      static get fonts() {
        return [${files
          .map((file) => {
            const fileName = file.name.split(".")[0]!;
            return `this.${convertCase(fileName, config.case)}`;
          })
          .join(",")}];
        }
  }
  `;
}

export async function createMainClassAndExport() {
  const config = await getConfig();

  return `
  class ${config.className ?? defaultConfigOptions.className} {
    private constructor() {}

    // private static instance: ${config.className ?? defaultConfigOptions.className};

    static readonly ${convertCase("root", config.case)} = AssetsRootGen;
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
