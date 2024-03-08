/// GENERATED CODE - DO NOT MODIFY BY HAND
/// *****************************************************
///  Assetize Generator - DO NOT CHANGE
/// *****************************************************

class AssetItem {
  private _assetName: string;
  private _keyName: string;

  constructor(assetName: string) {
    this._assetName = assetName;
    this._keyName = assetName.split("/").pop()?.split(".")[0]! || assetName;
  }

  get keyName() {
    return this._keyName;
  }

  get path() {
    return this._assetName;
  }
}
class AssetsIconsGen {
  constructor() {}

  private static instance: AssetsIconsGen;

  static readonly next_test: AssetItem = new AssetItem(
    "public/icons/next-test.svg",
  );
  static readonly vercel: AssetItem = new AssetItem("public/icons/vercel.svg");

  static get icons() {
    return [this.next_test, this.vercel];
  }
}
class AssetsImagesGen {
  constructor() {}

  private static instance: AssetsImagesGen;

  static readonly vercel: AssetItem = new AssetItem("public/images/vercel.png");

  static get images() {
    return [this.vercel];
  }
}

class AssetsFontsGen {
  constructor() {}

  private static instance: AssetsFontsGen;

  static readonly Genetic: AssetItem = new AssetItem(
    "./assets/fonts/Genetic.ttf",
  );

  static get fonts() {
    return [this.Genetic];
  }
}

class MyAssets {
  private constructor() {}

  static readonly icons = AssetsIconsGen;
  static readonly images = AssetsImagesGen;
  static readonly fonts = AssetsFontsGen;
}

export default MyAssets;
