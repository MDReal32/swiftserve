import { MiddlewareFn } from "./middleware";
import { ServeStaticOptions } from "./serve-static-options";

export type ServeStaticFn = (path: string, options?: ServeStaticOptions) => MiddlewareFn;
