import _ from "lodash";
import { Config, getConfig } from "../config";
import fs from "fs-extra";
import path, { join } from "node:path";
import { exec, spawn } from "node:child_process";
import { logger } from "./logger";

export function normalizeString(str: string): string {
  const normalizedStr = str
    .replace(/-/g, "_")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "");
  return normalizedStr;
}

export function convertCase(input: string, type: Config["case"]): string {
  switch (type) {
    case "camel":
      return input.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
    case "pascal":
      return input.replace(/(?:^|-|_)(\w)/g, (_, c) => c.toUpperCase());
    case "kebab":
      return input
        .replace(/-/g, "_")
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "");
    case "snake":
      return input.replace(/[A-Z]/g, (match, index) =>
        index === 0 ? match.toLowerCase() : `_${match.toLowerCase()}`,
      );
    default:
      return input
        .replace(/-/g, "_")
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "");
  }
}

interface PackageJSON {
  scripts: {
    [key: string]: string;
  };
}

export function getPackageJSON(): PackageJSON | undefined {
  const packageJSONPath = path.resolve(process.cwd(), "package.json");

  try {
    return JSON.parse(fs.readFileSync(packageJSONPath, "utf-8"));
  } catch (error) {
    return undefined;
  }
}

export async function getCodebase(): Promise<Config["codebase"] | undefined> {
  try {
    const packageJSON = getPackageJSON();

    if (!packageJSON) {
      // console.log("No package.json found");
      return undefined;
    }

    if (packageJSON.scripts && packageJSON.scripts.build) {
      const buildScript = packageJSON.scripts.build.toLowerCase();

      if (buildScript.includes("react")) {
        return "react";
      } else if (buildScript.includes("remix")) {
        return "remix";
      } else if (buildScript.includes("next")) {
        return "next";
      } else if (buildScript.includes("solid")) {
        return "solid";
      } else if (buildScript.includes("svelte")) {
        return "svelte";
      } else if (buildScript.includes("vue")) {
        return "vue";
      } else if (buildScript.includes("astro")) {
        return "astro";
      } else if (buildScript.includes("nuxt")) {
        return "nuxt";
      } else {
        // console.log("No matched codebase found");
        return undefined;
      }
    }
  } catch (error) {
    console.log("Error while reading the package json!");
  }

  return undefined;
}

export function addScriptToPackageJSON(
  scriptName: string,
  scriptCommand: string,
): void {
  const packageJSONPath = path.resolve(process.cwd(), "package.json");

  try {
    const packageJSON = getPackageJSON();

    if (!packageJSON) throw new Error("No package.json found");

    packageJSON.scripts = packageJSON.scripts || {};
    packageJSON.scripts[scriptName] = scriptCommand;

    fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));
    console.log(`Script '${scriptName}' added to package.json`);
  } catch (error) {
    console.error("Error adding script to package.json:", error);
  }
}

/**
 * Check if a directory contains only files (not directories).
 * @param directoryPath The path to the directory.
 * @returns A boolean indicating whether the directory contains only files.
 */
export function directoryContainsFiles(directoryPath: string): boolean {
  try {
    // Read the contents of the directory
    const contents = fs.readdirSync(directoryPath);

    // Check if there are any files in the directory
    return contents.some((item) => {
      const itemPath = `${directoryPath}/${item}`;
      return fs.statSync(itemPath).isFile();
    });
  } catch (error) {
    console.error("Error checking directory:", error);
    return false;
  }
}

export async function mergeDirectories(src: string, dest: string) {
  const files = await fs.readdir(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stats = await fs.stat(srcPath);
    if (stats.isDirectory()) {
      await fs.ensureDir(destPath);
      await mergeDirectories(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

export async function createAssetsDirectory(assetsDir = "./assets") {
  try {
    await fs.ensureDir(assetsDir);
    const config = await getConfig();

    //? TODO: create isssues to new directories
    const directories = [
      "icons",
      "images",
      "fonts",
      "audios",
      // "videos",
      // "svgs",
      // "pdfs",
      // "docs",
      // "others",
    ];

    const isIntegrationsEmpty =
      Object.keys(config.assets?.integrations ?? {}).length === 0;

    const subDirectories = isIntegrationsEmpty
      ? directories
      : Object.keys(config.assets?.integrations ?? directories).filter((dir) =>
          directories.includes(dir),
        );

    //? TODO: create isssues to new directories
    for (const subDir of subDirectories) {
      const dirPath = path.join(assetsDir, subDir);
      try {
        await fs.ensureDir(dirPath);
      } catch (err: any) {
        if (err.code === "EEXIST") {
          await mergeDirectories(dirPath, dirPath);
        } else {
          throw err;
        }
      }
    }
    console.log(`Success : Created assets directory.`);
  } catch (error: any) {
    console.error(error.message);
  }
}

type PackageManager = "npm" | "yarn" | "pnpm" | "bun" | "unknown";

export function detectPackageManager(): PackageManager {
  const projectDir = process.cwd();

  if (fs.existsSync(path.join(projectDir, "yarn.lock"))) {
    return "yarn";
  }

  if (
    fs.existsSync(path.join(projectDir, "pnpm-lock.yaml")) ||
    fs.existsSync(path.join(projectDir, "pnpm-workspace.yaml"))
  ) {
    return "pnpm";
  }

  if (fs.existsSync(path.join(projectDir, "package-lock.json"))) {
    return "npm";
  }

  if (fs.existsSync(path.join(projectDir, "bun.lockb"))) {
    return "bun";
  }

  return "unknown";
}

export async function installDependencies() {
  const pkgmanager = detectPackageManager();
  logger.info(`Package manager detected: ${pkgmanager}`);

  switch (pkgmanager) {
    case "yarn": {
      const command = "yarn";
      const args = ["add", "assetize"];

      const childProcess = spawn(command, args, {});

      childProcess.on("message", (message) => {
        // console.log(message);
      });

      childProcess.on("spawn", () => {
        console.log("Installing dependencies...");
      });

      childProcess.on("error", (error) => {
        console.log(error.cause);
        console.error(`Error executing command: ${error.message}`);
        process.exit(1);
      });

      childProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Dependencies installed successfully");
          process.exit(0);
        } else {
          console.error(`Dependencies installation failed with code ${code}`);
          process.exit(1);
        }
      });

      return;
    }
    case "pnpm": {
      const command = "pnpm";
      const args = ["install", "assetize"];

      const childProcess = spawn(command, args, {});

      childProcess.on("message", (message) => {
        // console.log(message);
      });

      childProcess.on("spawn", () => {
        console.log("Installing dependencies...");
      });

      childProcess.on("error", (error) => {
        console.log(error.cause);
        console.error(`Error executing command: ${error.message}`);
        process.exit(1);
      });

      childProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Dependencies installed successfully");
          process.exit(0);
        } else {
          console.error(`Dependencies installation failed with code ${code}`);
          process.exit(1);
        }
      });
      return;
    }
    case "npm": {
      const command = "npm";
      const args = ["install", "assetize"];

      const childProcess = spawn(command, args, {});

      childProcess.on("message", (message) => {
        // console.log(message);
      });

      childProcess.on("spawn", () => {
        console.log("Installing dependencies...");
      });

      childProcess.on("error", (error) => {
        console.log(error.cause);
        console.error(`Error executing command: ${error.message}`);
        process.exit(1);
      });

      childProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Dependencies installed successfully");
          process.exit(0);
        } else {
          console.error(`Dependencies installation failed with code ${code}`);
          process.exit(1);
        }
      });
      return;
    }
    case "bun": {
      const command = "bun";
      const args = ["install", "assetize"];

      const childProcess = spawn(command, args, {});

      childProcess.on("message", (message) => {
        // console.log(message);
      });

      childProcess.on("spawn", () => {
        console.log("Installing dependencies...");
      });

      childProcess.on("error", (error) => {
        console.log(error.cause);
        console.error(`Error executing command: ${error.message}`);
        process.exit(1);
      });

      childProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Dependencies installed successfully");
          process.exit(0);
        } else {
          console.error(`Dependencies installation failed with code ${code}`);
          process.exit(1);
        }
      });
      return;
    }
    default:
      console.error("Unsupported package manager");
      process.exit(1);
  }
}

export function generatePublicPath(
  joinedPath: string,
  codebase: Config["codebase"],
) {
  if (!joinedPath) {
    return "";
  }

  const base = path.parse(joinedPath).base;

  console.log(base);

  switch (codebase) {
    case "remix":
      return joinedPath;
    case "react":
      return "/_assetize";
    case "next":
      return `${joinedPath.split("/").slice(0, -1).join("/")}/${base}`;
    case "vue":
      return "/_assetize";
    case "svelte":
      return "/_assetize";
    case "solid":
      return "/_assetize";
    case "astro":
      return "/_assetize";
    case "nuxt":
      return "/_assetize";
    default:
      return "";
  }
}
