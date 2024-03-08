import _ from "lodash";
import { Config, getConfig } from "../config";
import fs from "node:fs";
import path from "node:path";

export async function convertCase(value: string): Promise<string> {
  const config = await getConfig();

  switch (config.case) {
    case "camel":
      return _.camelCase(value);
    case "kebab":
      return _.kebabCase(value);
    case "pascal":
      return _.upperFirst(_.camelCase(value));
    case "snake":
      return _.snakeCase(value);
    default:
      return value;
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
  // const config = await getConfig();

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
