import { defineAssetizeConfig } from "./src/config";

export default defineAssetizeConfig({
  lineLength: 80,
  codebase: "remix",
  assets: {
    path: "./assets",
  },
  case: "camel",
  className: "MyAssets",
});
