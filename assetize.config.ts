import { defineAssetizeConfig } from "./src/config/assetize.config.ts";

export default defineAssetizeConfig({
  codebase: "react",
  assets: {
    path: "./public",
  },
});
