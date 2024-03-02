export interface AssetizeConfigOptions {
  outputPath?: string;
  mainAssetPath?: string;
}

export function defineAssetizeConfig(options: AssetizeConfigOptions) {
  return options;
}
