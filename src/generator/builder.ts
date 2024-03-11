import fs from "fs-extra";
import path from "path";
import { Config } from "../config";
import { convertCase, generatePublicPath } from "../utils";

export class AssetClassBuilder {
  private className: string;
  private mainRoute: string;
  private config: Config;
  // private assets: { name: string; file: string }[];
  private staticget: string;
  private files: string[];
  private outputFileType: "ts" | "js";

  constructor(
    className: string,
    mainRoute: string,
    config: any,
    staticget = "assets",
    outputFileType: "ts" | "js" = "ts",
  ) {
    this.className = className;
    this.mainRoute = mainRoute;
    this.config = config;
    this.staticget = convertCase(staticget, config.case);
    this.outputFileType = outputFileType;
    this.files = fs.readdirSync(mainRoute).filter((file) => {
      const filePath = path.join(mainRoute, file);
      const stat = fs.statSync(filePath);
      return stat.isFile();
    });
  }

  private getUniqueFileNamesArray() {
    const fileNames = new Set<string>();
    const uniqueFileNamesArray: { name: string; file: string }[] = [];

    this.files.forEach((file) => {
      const fileName = file.split(".")[0]!; // Extract the filename without extension
      if (fileNames.has(fileName)) {
        console.log("double in files");
        const name = `${fileName}_${file.split(".")[1]}`;
        uniqueFileNamesArray.push({ name, file });
      } else {
        fileNames.add(fileName);
        uniqueFileNamesArray.push({ name: fileName, file });
      }
    });

    return uniqueFileNamesArray;
  }

  public generateClassCode() {
    const uniqueFileNamesArray = this.getUniqueFileNamesArray();

    if (this.outputFileType === "js") {
      const classDefinition = `class ${this.className} {
        constructor() {}

        static instance;

        ${uniqueFileNamesArray
          .map((item) => {
            const joinedPath = path.join(this.mainRoute, item.file);
            return `// ${item.name} - path : ${joinedPath}\nstatic ${convertCase(
              item.name,
              this.config.case,
            )} = new AssetItem("${generatePublicPath(
              joinedPath,
              this.config.codebase,
            )}");`;
          })
          .join("\n")}

        static get ${this.staticget}() {
          return [
            ${uniqueFileNamesArray
              .map((item) => {
                return `this.${convertCase(item.name, this.config.case)}`;
              })
              .join(",")}
          ];
        }
      }`;

      return classDefinition;
    } else if (this.outputFileType === "ts") {
      const classDefinition = `class ${this.className} {
      constructor() {}

      private static instance: ${this.className};

      ${uniqueFileNamesArray
        .map((item) => {
          const joinedPath = path.join(this.mainRoute, item.file);
          return `// ${item.name} - path : ${joinedPath}\nstatic readonly ${convertCase(
            item.name,
            this.config.case,
          )}: AssetItem = new AssetItem("${generatePublicPath(
            joinedPath,
            this.config.codebase,
          )}");`;
        })
        .join("\n")}

      static get ${this.staticget}() {
        return [
          ${uniqueFileNamesArray
            .map((item) => {
              return `this.${convertCase(item.name, this.config.case)}`;
            })
            .join(",")}
        ];
      }
    }`;

      return classDefinition;
    } else {
      throw new Error(`Invalid output file type: ${this.outputFileType}`);
    }
  }
}

// ${this.files
//   .map((file) => {
//     let name;
//     const fileName = file.split(".")[0];
//     const checkIfSameNameExists = this.files.filter(
//       (f) => f.split(".")[0] === fileName,
//     );
//     if (checkIfSameNameExists.length > 1) {
//       name = `${fileName}_${file.split(".")[1]}`;
//     } else {
//       name = fileName;
//     }
//     return `this.${convertCase(name!, this.config.case)}`;
//   })
//   .join(",")}
