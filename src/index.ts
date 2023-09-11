import { Server } from "bun";
import "bun";

import { SwiftRequest } from "./extends/request";
import { SwiftResponse } from "./extends/response";
import {
  CreateFn,
  HttpServeOptions,
  Method,
  Middleware,
  MiddlewareFn,
  Route,
  BunServerInstance as _BunServerInstance
} from "./types";

declare module "bun" {
  export let create: CreateFn;
}

class BunServerInstance implements _BunServerInstance {
  readonly _routesMap: Map<string, Route<string, Method>>;
  readonly _serverOptions: HttpServeOptions;

  constructor(options: HttpServeOptions) {
    this._routesMap = new Map();
    this._serverOptions = { port: 3000 };
    Object.assign(this._serverOptions, options || {});
  }

  get routes() {
    return this._routesMap;
  }

  get<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]) {
    this.addRoute(path, "GET", middlewares);
    return this;
  }

  post<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]) {
    this.addRoute(path, "POST", middlewares);
    return this;
  }

  put<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]) {
    this.addRoute(path, "PUT", middlewares);
    return this;
  }

  patch<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]) {
    this.addRoute(path, "PATCH", middlewares);
    return this;
  }

  delete<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]) {
    this.addRoute(path, "DELETE", middlewares);
    return this;
  }

  head<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]) {
    this.addRoute(path, "HEAD", middlewares);
    return this;
  }

  options<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]) {
    this.addRoute(path, "OPTIONS", middlewares);
    return this;
  }

  connect<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]) {
    this.addRoute(path, "CONNECT", middlewares);
    return this;
  }

  trace<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]) {
    this.addRoute(path, "TRACE", middlewares);
    return this;
  }

  all<TPath extends string>(path: TPath, ...middlewares: MiddlewareFn<TPath>[]) {
    this.addRoute(path, "*", middlewares);
    return this;
  }

  use(...middlewares: MiddlewareFn<"*">[]) {
    this.addRoute("*", "*", middlewares);
    return this;
  }

  serve(): Server {
    const self = this;

    return Bun.serve({
      ...this._serverOptions,
      async fetch(req: Request, server: Server): Promise<Response> {
        const url = new URL(req.url);
        let foundRoute: Route<string, Method>;

        let m: RegExpMatchArray | null;
        for (let key of self._routesMap.keys()) {
          const regex = new RegExp(`^${key}\/?$`);

          if ((m = url.pathname.match(regex))) {
            foundRoute = self._routesMap.get(key)!;
            break;
          }
        }

        if (!foundRoute) {
          return self.notFound(url);
        }

        const foundMiddlewares = foundRoute.middlewares.filter(
          middleware =>
            middleware.method === "*" ||
            middleware.method.toUpperCase() === req.method.toUpperCase()
        );

        if (!foundMiddlewares.length) {
          return self.notFound(url);
        }

        const middlewareFns = foundMiddlewares.map(middleware => middleware.fn);
        const body = req.method === "GET" ? undefined : await req.json();

        for (const middleware of middlewareFns) {
          const result = await middleware(
            new SwiftRequest(
              req.url,
              req.method as Method,
              m?.groups as Record<string, string> | undefined,
              Object.fromEntries(url.searchParams.entries()),
              body,
              Object.fromEntries(req.headers.entries())
            ),
            new SwiftResponse()
          );
          if (result) {
            return result;
          }
        }

        return self.notFound(url);
      }
    });
  }

  private notFound(url: URL) {
    return new SwiftResponse()
      .status(404)
      .json({ message: `Route ${url.pathname} not found.`, status: 404 });
  }

  private addRoute<TPath extends string>(
    path: TPath,
    method: Method,
    middlewares: MiddlewareFn<TPath>[]
  ) {
    const prevRoute = this._routesMap.get(`${method}:${path}`);
    if (prevRoute) {
      prevRoute.middlewares.push(
        ...(middlewares.map(middleware => ({ method, fn: middleware })) as unknown as Middleware[])
      );
      return;
    }

    const partRegex = /^:(?<variable>\w+)(?:\((?<regex>.*)\))?$/;
    const paths = path.split("/");

    const regexParts = paths.map(path => {
      if (path.startsWith(":")) {
        const { variable, regex = ".*" } = partRegex.exec(path)?.groups || {};
        return `(?<${variable}>${regex})`;
      }

      return path === "*" ? ".*" : path;
    });

    const regexString = regexParts.join("\\/");

    const route: Route<string, Method> = {
      path,
      middlewares: middlewares.map(middleware => ({
        method,
        fn: middleware
      })) as unknown as Middleware[]
    };
    this._routesMap.set(regexString, route as unknown as Route<string, Method>);
  }
}

const __serverInstance__ = Symbol("serverInstance");
export const swiftserve: CreateFn = options => {
  options.singleton = options.singleton === undefined ? true : options.singleton;
  if (!options.singleton) {
    return new BunServerInstance(options);
  }

  return Bun[__serverInstance__] || (Bun[__serverInstance__] = new BunServerInstance(options));
};
Bun.create = swiftserve;

export { SwiftRequest, SwiftResponse };
export default swiftserve;
