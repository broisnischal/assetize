import { defineAssetizeConfig } from "assetize";
export default defineAssetizeConfig({
    lineLength: 80,
    codebase: "remix",
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
    output: "./app",
    outputFile: "assetize.gen.ts",
});
