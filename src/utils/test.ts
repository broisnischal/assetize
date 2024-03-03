// class AssetsIconsGen {
//   static get(name: string, iconfolder = "icons") {
//     return `./assets/${iconfolder}/${name}.svg`;
//   }

//   static set(name: string, value: string) {
//     this._cache[name] = value;
//   }

//   private static _cache: Record<string, string> = {};

//   static Genetic = AssetsIconsGen.get("Genetic");
//   static button = AssetsIconsGen.get("button");

//   static get icons() {
//     return Object.keys(this._cache) as (keyof typeof this._cache)[];
//   }
// // }

// class AssetsIconsGen {
//   private static instance: AssetsIconsGen;
//   private cache: Record<string, string>;

//   private constructor() {
//     this.cache = {};
//   }

//   public static getInstance(): AssetsIconsGen {
//     if (!AssetsIconsGen.instance) {
//       AssetsIconsGen.instance = new AssetsIconsGen();
//     }
//     return AssetsIconsGen.instance;
//   }

//   public get<T extends keyof typeof AssetsIconsGen.icons>(
//     name: T,
//     iconfolder = "icons"
//   ): string {
//     const cacheKey = this.getCacheKey(name, iconfolder);
//     if (!this.cache[cacheKey]) {
//       this.cache[cacheKey] = this.resolveAssetPath(name, iconfolder);
//     }
//     return this.cache[cacheKey] as string;
//   }

//   public set(name: string, value: string): void {
//     const cacheKey = this.getCacheKey(name);
//     this.cache[cacheKey] = value;
//   }

//   public get icons(): Record<string, string> {
//     return {
//       ...this.cache,
//     };
//   }

//   private getCacheKey(name: string, iconfolder = "icons"): string {
//     return `${iconfolder}/${name}`;
//   }

//   private resolveAssetPath(name: string, iconfolder: string): string {
//     return `./assets/${iconfolder}/${name}.svg`;
//   }
// }

// // Usage:
// const assetsIconsGen = AssetsIconsGen.getInstance();
// const geneticIcon = assetsIconsGen.get("Genetic"); // Type-safe, only accepts valid keys
// const buttonIcon = assetsIconsGen.get("button");

// export default assetsIconsGen;
