import _ from "lodash";
import { Config, getConfig } from "../config/get-config";
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
  const config = await getConfig();

  try {
    const packageJSON = getPackageJSON();

    if (!packageJSON) {
      console.log("No package.json found");
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
      }
    }
  } catch (error) {
    console.log("Error while reading the package json!");
  }

  return undefined;
}
