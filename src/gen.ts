// This is the generated code via script please don't change it!

class Assets {
  private static _cache: Record<string, string> = {};

  static get(name: string) {
    if (this._cache[name]) {
      return this._cache[name];
    }

    return (this._cache[name] = `./assets/${name}.svg`);
  }

  static set(name: string, value: string) {
    this._cache[name] = value;
  }

  static Genetic = Assets.get("Genetic");
  static button = Assets.get("button");
  static hamburger = Assets.get("hamburger");
  static rocket = Assets.get("rocket");
  static shoppingCart = Assets.get("shoppingCart");
}

export default Assets;
