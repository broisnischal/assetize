import { defineAssetizeConfig } from "./src/index";

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
  case: "camel",
  className: "MyAssets",
  output: "./app",
  outputFile: "assetize.gen.ts",
});
