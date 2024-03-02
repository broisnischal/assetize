declare module "assetize" {
  export default function assetize(
    files: string | string[],
    options?: AssetizeConfigOptions
  ): Promise<void>;
}

interface AssetizeConfigOptions {
  outputPath?: string;
  mainAssetPath?: string;
}
