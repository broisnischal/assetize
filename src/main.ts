#!/usr/bin/env node

import * as p from "@clack/prompts";
import fs from "node:fs";
import { setTimeout } from "node:timers/promises";
import color from "picocolors";
import prettier from "prettier";
import { Config } from "./config";
import { directoryContainsFiles, getCodebase } from "./utils";

export async function generateConfigFile() {
  console.clear();

  await setTimeout(1000);

  // const config = await getConfig();
  const detectedCodeBase = await getCodebase();

  p.intro(
    `${color.bgCyan(color.black(" Assetize: create your asset class "))}`,
  );

  const project = await p.group(
    {
      path: () =>
        p.text({
          message: "Where is your root asset folder?",
          placeholder: "./assets, ./public, ./src, etc.",
          defaultValue: "./public",
          initialValue: "./public",
          validate: (value) => {
            if (!value) return "Please enter a path.";
            if (value[0] !== ".") return "Please enter a relative path.";

            // if (directoryContainsFiles(value)) {
            //   return "Directory is not empty!";
            // }
          },
        }),

      codebase: () =>
        p.select({
          message: "Select a codebase",
          initialValue: detectedCodeBase ?? "remix",
          maxItems: 5,
          options: [
            { value: "remix", label: "Remix" },
            { value: "next", label: "Next" },
            { value: "react", label: "React" },
            { value: "svelte", label: "Svelte" },
            { value: "solid", label: "Solid" },
            { value: "astro", label: "Astro" },
            { value: "vue", label: "Vue" },
            { value: "custom", label: "Custom" },
          ],
        }),
      lineLength: () =>
        p.text({
          message: "Line length",
          defaultValue: "80",
          placeholder: "80",
          initialValue: "80",
          validate: (value) => (value ? undefined : "Please enter a number"),
        }),
      filetype: ({}) =>
        p.select({
          message: `Pick a config file type.`,
          initialValue: "ts",
          options: [
            { value: "ts", label: "TypeScript", hint: "assetize.config.ts" },
            { value: "js", label: "JavaScript", hint: "assetize.config.js" },
          ],
          maxItems: 1,
        }),
      integrations: () =>
        p.multiselect({
          message: "Select folder integrations.",
          initialValues: ["images", "icons"],
          options: [
            { value: "icons", label: "Icons", hint: "recommended" },
            { value: "images", label: "Images", hint: "recommended" },
            { value: "fonts", label: "Fonts" },
            { value: "audios", label: "Audios" },
          ],
        }),
      case: () =>
        p.select({
          message: "Convert case",
          initialValue: "camel" as Config["case"],
          maxItems: 1,
          options: [
            {
              label: "Camel Case",
              value: "camel",
            },
            {
              label: "Kebab Case",
              value: "kebab",
            },
            {
              label: "Pascal Case",
              value: "pascal",
            },
            {
              label: "Snake Case",
              value: "snake",
            },
          ],
        }),
      className: () =>
        p.text({
          message: "Class name",
          defaultValue: "MyAssets",
          placeholder: "MyAssets",
        }),
      outdir: () =>
        p.text({
          message: "Where is build file output directory?",
          defaultValue: "./src",
          initialValue: "./src",
          placeholder: "./src, ./dist, etc.",
          validate: (value) => {
            if (!value) return "Please enter a path.";
            if (value[0] !== ".") return "Please enter a relative path.";
          },
        }),
      outputFileName: () =>
        p.text({
          message: "Output file name?",
          defaultValue: "assetize.gen.ts",
          initialValue: "assetize.gen.ts",
          placeholder: "Name for generated file",
          validate: (value) => {
            if (value.includes("/"))
              return "Please enter a file name without path.";

            if (!value) return "Please enter a file name.";
          },
        }),
      generate: () =>
        p.confirm({
          message: "Generate a config file? (y/n)",
          initialValue: true,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    },
  );

  const configCode: Config = {
    lineLength: Number(project.lineLength),
    codebase: project.codebase ?? detectedCodeBase,
    assets: {
      path: project.path,
      integrations: {
        ...project.integrations.reduce(
          (acc, cur) => ({
            ...acc,
            [cur]: {
              path: `${project.path}/${cur}`,
            },
          }),
          {},
        ),
      },
    },
    case: project.case,
    className: project.className,
    output: project.outdir,
    outputFile: project.outputFileName,
  };

  if (project.generate) {
    const s = p.spinner();
    s.start("Generating and writing config file");

    const code = `import { defineAssetizeConfig } from "assetize/config";\n
    export default defineAssetizeConfig(${JSON.stringify(configCode, null, 2)} );`;

    const formattedCode = await prettier.format(code, {
      parser: "typescript",
    });

    fs.writeFileSync(`./assetize.config.${project.filetype}`, formattedCode);

    s.stop("Assetized!");
  } else {
    console.log("\nCancelled generation!\n");
  }

  let nextSteps = `        \n${
    project.generate ? "npx assetize init" : "npx assetize help\n"
  }`;

  p.note(nextSteps, "Next steps.");

  p.outro(
    `Problems? ${color.underline(color.cyan("https://github.com/broisnischal/assetize/issues"))}`,
  );
}

// generateConfigFile().catch(console.error);
