import fs from "fs";
import path from "path";
import prettier from "prettier";

export class Generator {
  private readonly mainAssetPath: string;
  private readonly outputPath?: string;

  constructor(mainAssetPath: string, outputPath?: string) {
    this.mainAssetPath = mainAssetPath;
    this.outputPath = outputPath;

    if (!fs.existsSync(this.mainAssetPath)) {
      throw new Error("The main asset path does not exist.");
    }

    // if (fs.existsSync(this.outputPath)) {
    //   throw new Error("The output path already exists.");
    // }

    // fs.mkdirSync(this.outputPath);

    // this.generateAssetsFile(this.mainAssetPath, this.outputPath);
  }

  generateAssetsClass(mainRoutePath: string): string {
    const files = fs.readdirSync(mainRoutePath);
    const svgFiles = files.filter((file) => path.extname(file) === ".svg");

    const assetLines = svgFiles.map((file) => {
      const fileName = path.basename(file, ".svg");

      return `  static ${fileName} = Assets.get("${fileName}");`;
    });

    return `// This is the generated code via script please don't change it!

    class Assets {
      private static _cache: Record<string, string> = {};

      static get(name: string) {
        if (this._cache[name]) {
          return this._cache[name];
        }

        return (this._cache[name] = \`./assets/\${name}.svg\`);
      }

      static set(name: string, value: string) {
        this._cache[name] = value;
      }

    ${assetLines.join("\n")}
    }

    export default Assets;
    `;
  }

  async generateAssetsFile(
    mainRoutePath: string,
    outputPath: string = "gen.ts"
  ) {
    const generatedCode = this.generateAssetsClass(mainRoutePath);

    const formattedCode = await prettier.format(generatedCode, {
      parser: "typescript",
    });

    fs.writeFileSync(outputPath, formattedCode);
  }

  async formatFile(filePath: string) {
    // const code = fs.readFileSync(filePath, "utf8");
    // fs.writeFileSync(filePath, await formattedCode, "utf8");
  }
}

// AssetsImage
// AssetsIcons
// AssetsAudios
// AssetsVideos
// AssetsStyles
// AssetsFonts
