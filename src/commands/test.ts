// import { Command } from "commander";
// import { logger } from "../utils/logger";
// import { addScriptToPackageJSON, createAssetsDirectory } from "../utils";
// import { Config, defaultConfigOptions, getConfig } from "../config";
// // import { execa } from "execa";
// import path, { join } from "path";
// import fs from "fs-extra";

// export const test = new Command()
//   .name("test")
//   .description("initialize your project and choose libraries")
//   .action(async () => {
//     const config = await getConfig();
//     // await createAssetsDirectory(config.assets?.path);

//     // const mainRoute = path.join(
//     //   config.assets?.path ?? defaultConfigOptions.assets.path,
//     // );

//     const mainRoute = path.join(
//       config.assets?.path ?? defaultConfigOptions.assets.path,
//       config.assets?.integrations?.icons?.path ??
//         defaultConfigOptions.assets.integrations.icons.path,
//     );

//     const files = fs.readdirSync(mainRoute).filter((file) => {
//       const filePath = path.join(mainRoute, file);
//       const stat = fs.statSync(filePath);
//       return stat.isFile();
//     });

//     files.map((file) => {
//       const joinedPath = path.join(mainRoute, file);
//       console.log(joinedPath);

//       generatePublicPath(joinedPath, "next");
//     });

//     function generatePublicPath(
//       joinedPath: string,
//       codebase: Config["codebase"],
//     ) {
//       if (!joinedPath) {
//         return "";
//       }

//       const extractFirst = path.parse(joinedPath);

//       const joinedPathWithoutFirst = path.join(
//         extractFirst.dir,
//         extractFirst.base,
//       );

//       const joinedPathWithoutFirstAndSecond = path.join(
//         extractFirst.dir,
//         extractFirst.base,
//         extractFirst.base,
//       );

//       // if (joinedPathWithoutFirst === joinedPathWithoutFirstAndSecond) {
//       //   return `/${extractFirst.base}`;
//       // }

//       const basename = path.parse(joinedPath).base;

//       const base = path.parse(joinedPath).dir;
//       const lastPart = path.parse(base).base;

//       const outputpath = removeFirstPath(joinedPath);

//       console.log(outputpath);

//       return removeFirstPath;

//       switch (codebase) {
//         case "remix":
//           return `/${lastPart}/${basename}`;
//         case "react":
//           return `./${joinedPath}`;
//         case "vite":
//           return `/${lastPart}/${basename}`;
//         case "next":
//           return `/${lastPart}/${basename}`;
//         case "vue":
//           return `/${lastPart}/${basename}`;
//         case "svelte":
//           return joinedPath; // TODO
//         case "solid":
//           return joinedPath; // TODO
//         case "astro":
//           return `/${lastPart}/${basename}`;
//         case "nuxt":
//           return `/${lastPart}/${basename}`;
//         case "custom":
//           return `./${joinedPath}`;
//         default:
//           return joinedPath;
//       }
//     }

//     // await $`npm install assetize`;

//     // logger.info(`Success : Project initialization completed.`);
//   });
