#!/usr/bin/env node

import * as p from "@clack/prompts";
import fs from "node:fs";
import { setTimeout } from "node:timers/promises";
import color from "picocolors";
import prettier from "prettier";
import { Config, getConfig } from "./config/get-config";
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
          defaultValue: "./assets",
          validate: (value) => {
            if (!value) return "Please enter a path.";
            if (value[0] !== ".") return "Please enter a relative path.";

            if (directoryContainsFiles(value)) {
              return "Directory is not empty!";
            }
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
      // type: ({ results }) =>
      //   p.select({
      //     message: `Pick a project type within "${results.path}"`,
      //     initialValue: "ts",
      //     maxItems: 5,
      //     options: [
      //       { value: "ts", label: "TypeScript" },
      //       { value: "js", label: "JavaScript" },
      //       { value: "rust", label: "Rust" },
      //       { value: "go", label: "Go" },
      //       { value: "python", label: "Python" },
      //       { value: "coffee", label: "CoffeeScript", hint: "oh no" },
      //     ],
      //   }),
      // tools: () =>
      //   p.multiselect({
      //     message: "Select additional tools.",
      //     initialValues: ["prettier", "eslint"],
      //     options: [
      //       { value: "prettier", label: "Prettier", hint: "recommended" },
      //       { value: "eslint", label: "ESLint", hint: "recommended" },
      //       { value: "stylelint", label: "Stylelint" },
      //       { value: "gh-action", label: "GitHub Action" },
      //     ],
      //   }),
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
    },
    case: project.case,
    className: project.className,
  };

  if (project.generate) {
    const s = p.spinner();
    s.start("Generating and writing config file");

    const code = `import { defineAssetizeConfig } from "assetize";
    export default defineAssetizeConfig(${JSON.stringify(configCode, null, 2)} );`;

    fs.writeFileSync("./assetize.config.ts", code);

    const formattedCode = await prettier.format(code, {
      parser: "typescript",
    });

    fs.writeFileSync("./assetize.config.ts", formattedCode);

    s.stop("Assetized!");
  } else {
    console.log("\nCancelled generation!\n");
  }

  // let nextSteps = `cd ${project.path}        \n${
  //   project.generate ? "" : "pnpm install\n"
  // }pnpm dev`;

  // p.note(nextSteps, "Next steps.");

  // p.outro(
  //   `Problems? ${color.underline(color.cyan("https://example.com/issues"))}`,
  // );
}

// generateConfigFile().catch(console.error);
