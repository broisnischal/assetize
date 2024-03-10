# [Assetify 🎨](https://npmjs.com/package/assetize)

[![npm version](https://img.shields.io/npm/v/assetize.svg)](https://www.npmjs.com/package/assetize)
[![npm downloads](https://img.shields.io/npm/dm/assetize.svg)](https://www.npmjs.com/package/assetize)
[![npm license](https://img.shields.io/npm/l/assetize.svg)](https://www.npmjs.com/package/assetize)
[![Open in GitHub Pages](https://img.shields.io/static/v1?label=GitHub&message=assetize&color=blue&style=flat-square)](https://assetize.netlify.app)

<!-- [![GitHub release](https://img.shields.io/github/release/assetize/assetize.svg)](https://github.com/assetize/assetize/releases) -->

A versatile assets class builder for your project!

#### Introduction

Tired of manually importing assets like `public/icons/myicon.ico` in your project? Say goodbye to the hassle with Assetify! This handy tool automates asset imports, making your workflow smoother and more efficient.

## Example

```tsx
// Import Assetify
import MyAssets from "./assetize.gen";

export default function Home() {
  return (
    <Image
      src={MyAssets.icons.vercel.path} // Access assets
      alt="Vercel Logo"
      width={202}
      height={206}
    />
  );
}
```

## Features

- **Streamlined Asset Imports:** With Assetify, you can import assets effortlessly using simple, clean syntax.
- **Customizable Asset Classes:** Tailor asset classes to suit your project's needs, ensuring consistency and organization.
- **Support for Various File Types:** Whether it's icons, images, fonts, or more, Assetify has you covered.
- **Easy Integration:** Integrate Assetify seamlessly into your project, enhancing productivity from the get-go.

### Install

```
npm install assetize
```

@anthonyfu - use ni instead of package mangers, [ni](https://github.com/antfu/ni)

### `npx assetize generate`

Generates a default config file in your project's root directory. you can generate yourself by importing `defineAssetizeConfig` from `assetize` and passing it your config. Config file name must be `assetize.config.{js,ts,mts,mjs}`.

```ts
import { defineAssetizeConfig } from "assetize";

export default defineAssetizeConfig({
  codebase: "remix",
});
```

### It will create the assets directory in your project's root directory.

```bash
npx assetize init
```

### Build

```sh
npx assetize build
```

Builds your assets according to your config file.

## Issues

Submit your issues to the [assetize](https://github.com/broisnischal/assetize/issues) repository. 🤖

## Support

- [x] Remix
- [x] Next JS
- [x] Svelte
- [ ] Vue
- [x] Vite
- [x] Nuxt
- [x] Astro
- [ ] Solid
- [x] Preact
- [ ] Solid

### Pubic Requested Assets folder

- Currently

  - icons
  - images
  - videos
  - svgs
  - fonts

- Todo add here
  - upcoming

## License

[MIT](https://github.com/broisnischal/assetize/blob/master/LICENSE)

## Contributing

See [contributing guide](https://github.com/broisnischal/assetize/blob/master/CONTRIBUTING.md)

## Star me on [GitHub](https://github.com/broisnischal/assetize) 🌟
