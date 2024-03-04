import _ from "lodash";
import { getConfig } from "../config/get-config";

export async function convertCase(value: string): Promise<string> {
  const config = await getConfig();

  switch (config.case) {
    case "camel":
      return _.camelCase(value);
    case "kebab":
      return _.kebabCase(value);
    case "pascal":
      return _.upperFirst(_.camelCase(value));
    case "snake":
      return _.snakeCase(value);
    default:
      return value;
  }
}
