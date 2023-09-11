import { Server } from "bun";

import { MiddlewareFn } from "./middleware";

export interface BunServerInstance {
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
  close(hard?: boolean): void;
}
