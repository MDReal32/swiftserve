import { BodyParserUrlEncodedOptions } from "./body-parser-url-encoded-options";
import { MiddlewareFn } from "./middleware";

export type UrlencodedFn = (options?: BodyParserUrlEncodedOptions) => MiddlewareFn;
