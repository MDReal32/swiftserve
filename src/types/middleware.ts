import { SwiftRequest } from "../extends/request";
import { SwiftResponse } from "../extends/response";
import { FetchParamsFromPath } from "./fetch-params-from-path";
import { Method } from "./method";
import { Promisable } from "./promisable";

export interface MiddlewareFn<TPath extends string = string> {
  (
    request: SwiftRequest<TPath, FetchParamsFromPath<TPath>>,
    response: SwiftResponse
  ): Promisable<Response | void>;
}

export interface Middleware<TPath extends string = string, TMethod extends Method = Method> {
  method: TMethod;
  fn: MiddlewareFn<TPath>;
}
