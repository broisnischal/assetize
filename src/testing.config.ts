import { defineAssetizeConfig } from "./assetize.config";

export default defineAssetizeConfig({
  mainAssetPath: "src",
  output: "src/gen",
  codebase: "remix",
});
