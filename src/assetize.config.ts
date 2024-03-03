// Common properties for all codebases
interface CommonAssetizeConfigOptions {
  // Output path for generated asset files
  outputGeneratedPath?: string;
  outputFileName?: string;
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
  test: "tes";
}

export interface ReactAssetizeConfigOptions
  extends CommonAssetizeConfigOptions {
  codebase: "react";
  publicDirectory: string;
  mainReactAssetPath?: string;
}

export interface NextAssetizeConfigOptions extends CommonAssetizeConfigOptions {
  codebase: "next";
  publicDirectory: string;
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
  publicDirectory: string;
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

/**
 * Define Assetize Config
 *
 * @export
 * @param {AssetizeConfigOptions} options
 * @returns {AssetizeConfigOptions}
 */
export function defineAssetizeConfig(options: AssetizeConfigOptions) {
  return options;
}

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

export type AssetizeConfig = ReturnType<typeof defineAssetizeConfig>;
