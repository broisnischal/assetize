// import { AssetizeConfig, defineAssetizeConfig } from "./";

import * as zod from "zod";

import { cosmiconfig } from "cosmiconfig";
import { logger } from "../logger";
import { assetsDirectoryLike } from "./help-log";

// const explorer = cosmiconfig("assetize");
// console.log(explorer.search());

// export async function loadUserConfig() {
// const rootDir = process.cwd(); // Get the root directory of the user's project

// console.log(rootDir);

// const configPath = path.join(rootDir, "assetize.config.js");

// console.log(configPath);

// let config: AssetizeConfig;

// try {
//   // Dynamically import the user's configuration file
//   const userConfigModule = await import(configPath);

//   config = userConfigModule.default || userConfigModule; // Handle ES6 default exports
// } catch (error) {
//   console.error("Error loading user configuration:", error);
//   config = {
//     outputFile: "gen.ts",
//     codebase: "remix",
//   }; // Fallback to default configuration
// }j

// return config;

//   console.log("testing");
//   const explorer = cosmiconfig("assetize");
//   console.log(explorer.load(process.cwd()));
// }

// async function main() {
//   const userConfig = await loadUserConfig();
//   console.log(userConfig);
// }

// main().catch(console.error);

// let userConfig = import("../../assetize.config");

// async function main() {
//   const config = await userConfig;
//   console.log(config);
// }

// main().catch(console.error);

const configSchema = zod.object({
  output: zod.string().optional().default("./src"),
  outputFile: zod.string().optional().default("assetize.gen.ts"),
  lineLength: zod.number().optional().default(80),
  className: zod.string().optional().default("MyAssets"),
  case: zod
    .enum(["camel", "kebab", "pascal", "snake"])
    .optional()
    .default("camel"),
  mainAssetPath: zod.string().optional().default("assets"),
  codebase: zod
    .enum(["remix", "react", "next", "solid", "svelte", "vue", "astro"])
    .optional()
    .default("next"),
  minifyAssets: zod.boolean().optional().default(true),
});

export type Config = zod.infer<typeof configSchema>;

// Use singleton so we can lazy load the env vars, which might be set as flags
let explorer: ReturnType<typeof cosmiconfig> | null;
function getExplorer() {
  // ? Do we really need cosmiconfig? We only support .json files
  // Other options would be nice but we need to be able to write to it
  // and other formats are prohibitively hard to write
  if (!explorer) {
    const paths = [
      "assetize.config.js",
      "assetize.config.ts",
      "assetize.config.cjs",
      "assetize.config.mjs",
    ];
    // TODO: submit a PR to add your config dir here
    const directories = ["", ".config", "config", "other"];

    explorer = cosmiconfig("assetize", {
      searchPlaces: directories.flatMap((dir) =>
        paths.map((path) => `${dir}/${path}`),
      ),
      cache: Boolean(process.env.CACHE),
    });
  }
  return explorer;
}

export async function getConfigFilePath() {
  const configResult = await getExplorer().search();

  if (!configResult) {
    logger.error("Couldn't find assetize.config.ts or assetize.config.js");
    process.exit(1);
  }

  return configResult.filepath;
}

export async function getConfig(): Promise<Config> {
  const configResult = await getExplorer().search();

  if (!configResult) {
    assetsDirectoryLike();
    logger.error("Couldn't find assetize.config.ts or assetize.config.js");
    process.exit(1);
  }

  try {
    return configSchema.parse(configResult.config);
  } catch (error) {
    throw new Error("Invalid configuration in " + configResult.filepath);
  }
}

export async function setConfig() {}

// export async function loadConfig(): Promise<AssetizeConfig> {
//   let configPath = "./assetize.config.ts";
//   const explorer = cosmiconfig("assetize", {
//     cache: false,
//   });

//   const explicitPath = configPath
//     ? path.resolve(process.cwd(), configPath)
//     : undefined;

//   const explore = explicitPath ? explorer.load : explorer.search;
//   const searchPath = explicitPath ? explicitPath : process.cwd();
//   const local = await explore(searchPath);

//   if (local) {
//     return local.config satisfies AssetizeConfig;
//   }

//   return {
//     codebase: "remix",
//   } satisfies AssetizeConfig;
// }
