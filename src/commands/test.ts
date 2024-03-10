import { Command } from "commander";
import { logger } from "../utils/logger";
import {
  addScriptToPackageJSON,
  convertCase,
  createAssetsDirectory,
  generatePublicPath,
} from "../utils";
import path from "path";
import fs from "fs-extra";
import { Config, defaultConfigOptions, getConfig } from "../config";

export const test = new Command()
  .name("test")
  .description("initialize your project and choose libraries")
  .action(async () => {
    const config = await getConfig();
    const mainRoute = path.join(
      config.assets?.path ?? defaultConfigOptions.assets.path,
    );

    // const files = fs.readdirSync(mainRoute).filter((file) => {
    //   const filePath = path.join(mainRoute, file);
    //   const stat = fs.statSync(filePath);
    //   return stat.isFile();
    // });

    // const fileNames = new Map<string, string>();

    // files.map((file) => {
    //   const fileName = file.split(".")[0]!;

    //   if (fileNames.has(fileName)) {
    //     const name = `${fileName}_${file.split(".")[1]}`;
    //     fileNames.set(name, file);
    //   } else {
    //     const name = `${fileName}_${file.split(".")[1]}`;

    //     fileNames.set(name, file);
    //   }
    // });

    // const uniqueFileNamesArray = [...fileNames];

    // for (const [key, value] of uniqueFileNamesArray) {
    //   const joinedPath = path.join(mainRoute, value);

    //   const publicPath = generatePublicPath(joinedPath, config.codebase);

    //   const name = convertCase(key, config.case);

    //   const assetItem = `// ${name} - path : ${joinedPath}\nstatic readonly ${convertCase(
    //     key,
    //     config.case,
    //   )}: AssetItem = new AssetItem(
    //     "${publicPath}",
    //   );`;
    //   console.log(assetItem);
    // }

    const builder = new AssetClassBuilder(
      "AssetRoot",
      mainRoute,
      config,
      "icons",
    );
    const buildedCode = builder.generateClassCode();
    console.log(buildedCode);
  });

// ---

// import { Command } from "commander";
// import { logger } from "../utils/logger";
// import { addScriptToPackageJSON, createAssetsDirectory } from "../utils";
// import path from "path";
// import fs from "fs-extra";
// import { defaultConfigOptions, getConfig } from "../config";

// export const test = new Command()
//   .name("test")
//   .description("initialize your project and choose libraries")
//   .action(async () => {
//     const config = await getConfig();
//     const mainRoute = path.join(
//       config.assets?.path ?? defaultConfigOptions.assets.path,
//     );

//     const files = fs.readdirSync(mainRoute).filter((file) => {
//       const filePath = path.join(mainRoute, file);
//       const stat = fs.statSync(filePath);
//       return stat.isFile();
//     });

//     const fileNames = new Set();

//     files.map((file) => {
//       const fileName = file.split(".")[0]; // Extract the filename without extension

//       if (fileNames.has(fileName)) {
//         console.log("double in files");
//         const name = `${fileName}_${file.split(".")[1]}`;
//         fileNames.add(name);
//         console.log(name);
//       } else {
//         fileNames.add(fileName);
//       }
//     });

//     console.log(fileNames);

//     const uniqueFileNamesArray = [...fileNames];
//   });

// import { Command } from "commander";
// import { logger } from "../utils/logger";
// import { addScriptToPackageJSON, createAssetsDirectory } from "../utils";

// import path from "path";
// import fs from "fs-extra";
// import { defaultConfigOptions, getConfig } from "../config";
// // import { execa } from "execa";

// export const test = new Command()
//   .name("test")
//   .description("initialize your project and choose libraries")
//   .action(async () => {
//     const config = await getConfig();

//     const mainRoute = path.join(
//       config.assets?.path ?? defaultConfigOptions.assets.path,
//     );

//     const files = fs.readdirSync(mainRoute).filter((file) => {
//       const filePath = path.join(mainRoute, file);
//       const stat = fs.statSync(filePath);
//       return stat.isFile();
//     });

//     // console.log(files);

//     files.map((file) => {
//       let name;

//       const fileName = file.split(".")[0]; // Extract the filename without extension

//       const ifnameisdoubleinfiles = files.filter((file) => {
//         const fileName = file.split(".")[0];
//         return fileName === fileName;
//       });

//       if (ifnameisdoubleinfiles.length > 1) {
//         console.log("double in files");
//         name = `${fileName}_${file.split(".")[1]}`;
//       } else {
//         name = fileName;
//       }

//       console.log(name);

//       // console.log(name);

//       const joinedPath = path.join(mainRoute, file);
//     });
//   });
