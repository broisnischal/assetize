// import { AssetizeConfig, defineAssetizeConfig } from "./";

import * as zod from "zod";

import _ from "lodash";
import { cosmiconfig } from "cosmiconfig";
import { logger } from "../logger";
import { assetsDirectoryLike } from "./help-log";

const integrationSchema = zod.object({
  path: zod.string(),
});

const configSchema = zod.object({
  output: zod.string().default("./src").optional(),
  outputFile: zod
    .string()
    .default("assetize.gen.ts")
    .refine((x) => x.endsWith(".ts") || x.endsWith(".js"), {
      message: "outputFile must end with .ts or .js",
    })
    .optional(),
  lineLength: zod.number().default(80).optional(),
  className: zod
    .string()
    .default("MyAssets")
    .transform((x) => _.upperFirst(x).replace(/-/g, "")),
  case: zod
    .enum(["camel", "kebab", "pascal", "snake"])
    .default("camel")
    .optional(),
  assets: zod
    .object({
      path: zod.string().default("assets"),
      integrations: zod
        .object({
          icons: integrationSchema
            .default({
              path: "icons",
            })
            .optional(),
          images: integrationSchema
            .default({
              path: "images",
            })
            .optional(),
          fonts: integrationSchema
            .default({
              path: "fonts",
            })
            .optional(),
          videos: integrationSchema
            .default({
              path: "videos",
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  codebase: zod
    .enum(["remix", "react", "next", "solid", "svelte", "vue", "astro"])
    .optional(),
  minifyAssets: zod.boolean().default(true).optional(),
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

export async function getConfig() {
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
