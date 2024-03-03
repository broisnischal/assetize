import _ from "lodash";

type Icons = {
  Genetic: "Genetic.svg";
  button: "button.svg";
};

class AssetItem {
  private _assetName: string;

  constructor(assetName: string) {
    this._assetName = assetName;
  }

  get keyName() {
    return this._assetName;
  }

  get path() {
    return this._assetName;
  }
}

export class AssetsSvgsGen {
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
