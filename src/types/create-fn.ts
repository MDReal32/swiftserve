import { SwiftServeInstance } from "../core";
import { CorsFn } from "./cors-fn";
import { HttpServeOptions } from "./http-server-options";
import { JsonFn } from "./json-fn";
import { ServeStaticFn } from "./serve-static-fn";
import { UrlencodedFn } from "./urlencoded-fn";

export type CreateFn = (<T extends object = object>(
  options?: HttpServeOptions & T
) => SwiftServeInstance<T>) & {
  static: ServeStaticFn;
  cors: CorsFn;
  json: JsonFn;
  urlencoded: UrlencodedFn;
};
