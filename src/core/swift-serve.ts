import { CreateFn } from "../types";
import { cors } from "./cors";
import { json } from "./json";
import { serveStatic } from "./serve-static";
import { SwiftServeInstance } from "./swift-serve-instance";
import { urlencoded } from "./urlencoded";

const __serverInstance__ = Symbol("serverInstance");
export const swiftserve: CreateFn = options => {
  options.singleton = options.singleton === undefined ? true : options.singleton;
  if (!options.singleton) {
    return new SwiftServeInstance(options);
  }

  return Bun[__serverInstance__] || (Bun[__serverInstance__] = new SwiftServeInstance(options));
};
swiftserve.static = serveStatic;
swiftserve.cors = cors;
swiftserve.json = json;
swiftserve.urlencoded = urlencoded;
