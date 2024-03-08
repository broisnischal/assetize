import * as zod from "zod";

import _ from "lodash";
import { cosmiconfig } from "cosmiconfig";
import { logger } from "../utils/logger";

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
    .transform((x) => _.upperFirst(x).replace(/-/g, ""))
    .optional(),
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
    .enum([
      "remix",
      "react",
      "next",
      "solid",
      "svelte",
      "vue",
      "astro",
      "nuxt",
      "custom",
    ])
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
    logger.error("Couldn't find assetize.config.ts or assetize.config.js");
    process.exit(1);
    // return undefined;
  }

  try {
    return configSchema.parse(configResult.config);
  } catch (error) {
    throw new Error("Invalid configuration in " + configResult.filepath);
  }
}

export async function setConfig() {}

// Common properties for all codebases
interface CommonAssetizeConfigOptions {
  // Output path for generated asset files
  output?: string;
  outputFile?: string;
  lineLength?: number;
  case?: "camel" | "kebab" | "pascal" | "snake";
  // Path to the main asset directory
  mainAssetPath?: string;
  // Base codebase for the project
  codebase: "remix" | "react" | "next" | "solid" | "svelte" | "vue" | "astro";
  // Whether to minify generated assets (default is false)
  minifyAssets?: boolean;
}

/**
 * Remix Assetize Config
 *
 * @export
 * @interface RemixAssetizeConfigOptions
 * @typedef {RemixAssetizeConfigOptions}
 * @extends {CommonAssetizeConfigOptions}
 */
export interface RemixAssetizeConfigOptions
  extends CommonAssetizeConfigOptions {
  codebase: "remix";
}

export interface ReactAssetizeConfigOptions
  extends CommonAssetizeConfigOptions {
  codebase: "react";
  publicDirectory: string;
  mainReactAssetPath?: string;
}

export interface NextAssetizeConfigOptions extends CommonAssetizeConfigOptions {
  codebase: "next";
  publicDirectory?: string;
  mainNextAssetPath?: string;
}

export interface SvelteAssetizeConfigOptions
  extends CommonAssetizeConfigOptions {
  codebase: "svelte";
  publicDirectory: string;
  mainSvelteAssetPath?: string;
}

export interface VueAssetizeConfigOptions extends CommonAssetizeConfigOptions {
  codebase: "vue";
  publicDirectory: string;
  mainVueAssetPath?: string;
}

export interface AstroAssetizeConfigOptions
  extends CommonAssetizeConfigOptions {
  codebase: "astro";
  publicDirectory: string;
  mainAstroAssetPath?: string;
}

export interface SolidAssetizeConfigOptions
  extends CommonAssetizeConfigOptions {
  codebase: "solid";
  publicDirectory?: string;
  mainSolidAssetPath?: string;
}

/**
 * Assetize Config
 * @typedef {AssetizeConfigOptions}
 */
type AssetizeConfigOptions =
  | RemixAssetizeConfigOptions
  | ReactAssetizeConfigOptions
  | NextAssetizeConfigOptions
  | SvelteAssetizeConfigOptions
  | VueAssetizeConfigOptions
  | AstroAssetizeConfigOptions
  | SolidAssetizeConfigOptions;

// type AssetizeConfigOptions =
// | ({
//     codebase: "remix";
//   } & Exclude<RemixAssetizeConfigOptions, "codebase">)
// | ({
//     codebase: "react";
//   } & Exclude<ReactAssetizeConfigOptions, "codebase">);

// const allowedFileTypes = [
//   "image/jpeg",
//   "image/png",
//   "image/gif",
//   "image/webp",
//   "image/bmp",
//   "image/tiff",
//   "image/svg+xml",
//   "video/mp4",
//   "video/quicktime",
//   "audio/mpeg",
//   "application/pdf",
//   "application/zip",
//   "text/markdown",
//   "text/plain",
// ] as const;

// export function isAssetFile(file: string) {
//   return allowedFileTypes.includes(file as keyof typeof allowedFileTypes);
// }

// export function isAssetFolder(folder: string) {
//   return fs.existsSync(path.join(folder, "assets"));
// }

const allowedFileTypes = {
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  quicktime: "video/quicktime",
  mpeg: "audio/mpeg",
  pdf: "application/pdf",
  zip: "application/zip",
  markdown: "text/markdown",
  plain: "text/plain",
} as const;

export type AllowedFileTypes =
  (typeof allowedFileTypes)[keyof typeof allowedFileTypes];

/**
 * Define Assetize Config
 *
 * @export
 * @param {AssetizeConfigOptions} options
 * @returns {AssetizeConfigOptions}
 */
export function defineAssetizeConfig(options: Config) {
  return options;
}

export type AssetizeConfig = ReturnType<typeof defineAssetizeConfig>;

export const defaultConfigOptions = {
  output: "./src",
  outputFile: "assetize.gen.ts",
  lineLength: 80,
  className: "MyAssets",
  case: "camel",
  assets: {
    path: "assets",
    integrations: {
      fonts: {
        path: "fonts",
      },
      icons: {
        path: "icons",
      },
      images: {
        path: "images",
      },
      videos: {
        path: "videos",
      },
    },
  },
  codebase: "remix",
  minifyAssets: false,
} satisfies Config;
