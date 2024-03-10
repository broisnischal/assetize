# [assetize](https://npmjs.com/package/assetize)

[![npm version](https://img.shields.io/npm/v/assetize.svg)](https://www.npmjs.com/package/assetize)
[![npm downloads](https://img.shields.io/npm/dm/assetize.svg)](https://www.npmjs.com/package/assetize)
[![npm license](https://img.shields.io/npm/l/assetize.svg)](https://www.npmjs.com/package/assetize)
[![Open in GitHub Pages](https://img.shields.io/static/v1?label=GitHub&message=assetize&color=blue&style=flat-square)](https://assetize.netlify.app)

<!-- [![GitHub release](https://img.shields.io/github/release/assetize/assetize.svg)](https://github.com/assetize/assetize/releases) -->

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

## License

[ISC](https://github.com/broisnischal/assetize/blob/master/LICENSE)

## Contributing

See [contributing guide](https://github.com/broisnischal/assetize/blob/master/CONTRIBUTING.md)

## Issues

Submit your issues to the [assetize](https://github.com/broisnischal/assetize/issues) repository. 🤖

<!-- // AssetsImage
// AssetsIcons
// AssetsAudios
// AssetsVideos
// AssetsStyles
// AssetsFonts -->

### Pubic Requested Assets folder

- Currently

  - icons
  - images
  - videos
  - svgs
  - fonts

- Todo add here
  - upcoming

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

Star me on [GitHub](https://github.com/broisnischal/assetize) 🌟
