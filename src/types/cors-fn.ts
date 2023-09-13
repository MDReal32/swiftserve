import { CorsOptions } from "./cors-options";
import { MiddlewareFn } from "./middleware";

export type CorsFn = (options?: CorsOptions) => MiddlewareFn;
