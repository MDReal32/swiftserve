import { CreateFn } from "../types";
import { cors } from "./cors";
import { serveStatic } from "./serve-static";
import { SwiftServeInstance } from "./swift-serve-instance";

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
