import { SwiftServeInstance } from "../core";
import { CorsFn } from "./cors-fn";
import { HttpServeOptions } from "./http-server-options";
import { ServeStaticFn } from "./serve-static-fn";

export type CreateFn = (<T extends object = object>(
  options?: HttpServeOptions & T
) => SwiftServeInstance<T>) & {
  static: ServeStaticFn;
  cors: CorsFn;
};
