import "bun";

import { SwiftRequest } from "./extends/request";
import { SwiftResponse } from "./extends/response";
import { FetchParamsFromPath, NextFn } from "./types";

type Promisable<T> = T | Promise<T>;

declare module "bun" {
  type MethodUppercase =
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"
    | "HEAD"
    | "OPTIONS"
    | "TRACE"
    | "CONNECT";
  type MethodLowercase =
    | "get"
    | "post"
    | "put"
    | "delete"
    | "patch"
    | "head"
    | "options"
    | "trace"
    | "connect";
  export type Method = MethodUppercase | MethodLowercase | "*";

  export interface MiddlewareFn<TPath extends string = string> {
    (
      request: SwiftRequest<TPath, FetchParamsFromPath<TPath>>,
      response: SwiftResponse,
      next?: NextFn
    ): Promisable<Response | void>;
  }

  export interface Middleware<TPath extends string = string, TMethod extends Method = Method> {
    method: TMethod;
    fn: MiddlewareFn<TPath>;
  }

  export interface Route<TPath extends string, TMethod extends Method> {
    path: TPath;
    middlewares: Middleware<TPath, TMethod>[];
  }

  export type HttpServeOptions = (
    | Omit<ServeOptions, "fetch">
    | Omit<TLSServeOptions, "fetch">
    | Omit<UnixServeOptions, "fetch">
    | Omit<UnixTLSServeOptions, "fetch">
  ) & { singleton?: boolean };

  interface BunServerInstance {
    get<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]): this;
    post<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]): this;
    put<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]): this;
    patch<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]): this;
    delete<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]): this;
    head<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]): this;
    options<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]): this;
    trace<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]): this;
    connect<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]): this;
    all<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]): this;
    use(...middlewares: MiddlewareFn<"*">[]): this;

    serve(): Server;
  }

  type Create = (options?: HttpServeOptions) => BunServerInstance;
  export let create: Create;
}
