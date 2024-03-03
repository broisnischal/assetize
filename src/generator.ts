import _ from "lodash";

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

type Icons = {
  Genetic: "Genetic.svg";
  button: "button.svg";
};

class AssetsSvgsGen {
  constructor() {}

  private static instance: AssetsSvgsGen;

  static get<T extends keyof Icons>(name: T, iconfolder = "icons"): AssetItem {
    return new AssetItem(`./assets/${iconfolder}/${name}.svg`);
  }

  static readonly Genetic: AssetItem = AssetsSvgsGen.get("Genetic");
  static readonly button: AssetItem = AssetsSvgsGen.get("button");

  static get icons() {
    return [this.Genetic, this.button];
  }
}

type Images = {
  Genetic: "Genetic.jpg";
  button: "button.png";
};

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

/// Assets
class MyAssets {
  private constructor() {}

  static readonly icons = AssetsSvgsGen;
  static readonly images = AssetsImagesGen;
}

export default MyAssets;

const geneticImage = MyAssets.images.Genetic.keyName;

console.log(geneticImage);
