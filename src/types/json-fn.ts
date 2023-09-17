import { BodyParserJsonOptions } from "./body-parser-json-options";
import { MiddlewareFn } from "./middleware";

export type JsonFn = (options?: BodyParserJsonOptions) => MiddlewareFn;
