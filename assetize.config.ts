import { defineAssetizeConfig } from "./src";

export default defineAssetizeConfig({
  lineLength: 80,
  codebase: "next",
  assets: {
    path: "./public",
    integrations: {
      images: {
        path: "./images",
      },
      icons: {
        path: "./icons",
      },
      fonts: {
        path: "./fonts",
      },
    },
  },
  case: "snake",
  className: "MyCustomAssets",
  output: "./src",
  outputFile: "assetize.gen.ts",
});
