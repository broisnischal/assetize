/// GENERATED CODE - DO NOT MODIFY BY HAND
/// *****************************************************
///  Assetize Generator - DO NOT CHANGE
/// *****************************************************

class AssetItem {
  private _assetName: string;
  private _keyName: string;

  constructor(assetName: string) {
    this._assetName = assetName;
    this._keyName = assetName.split("/").pop()?.split(".")[0]!;
  }

  get keyName() {
    return this._keyName;
  }

  get path() {
    return this._assetName;
  }
}

class AssetsSvgsGen {
  constructor() {}

  private static instance: AssetsSvgsGen;

  static readonly Genetic: AssetItem = new AssetItem(
    "./assets/icons/Genetic.svg"
  );
  static readonly button: AssetItem = new AssetItem(
    "./assets/icons/button.svg"
  );

  static get icons() {
    return [this.Genetic, this.button];
  }
}

class AssetsImagesGen {
  constructor() {}

  private static instance: AssetsImagesGen;

  static readonly Genetic: AssetItem = new AssetItem(
    "./assets/images/Genetic.jpg"
  );
  static readonly ButtonImage: AssetItem = new AssetItem(
    "./assets/images/button.png"
  );

  static get images() {
    return [this.Genetic, this.ButtonImage];
  }
}

class AssetsFontsGen {
  constructor() {}

  private static instance: AssetsFontsGen;

  static readonly Genetic: AssetItem = new AssetItem(
    "./assets/fonts/Genetic.ttf"
  );

  static get fonts() {
    return [this.Genetic];
  }
}

/// Assets
class MyAssets {
  private constructor() {}

  static readonly icons = AssetsSvgsGen;
  static readonly images = AssetsImagesGen;
  static readonly fonts = AssetsFontsGen;
}

export default MyAssets;
