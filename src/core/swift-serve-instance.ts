import { Server } from "bun";
import { EventEmitter } from "events";

import { SwiftRequest, SwiftResponse } from "../extends";
import {
  ConvertValuesToArray,
  HttpServeOptions,
  Method,
  Middleware,
  MiddlewareFn,
  Route
} from "../types";

interface Events {}

export class SwiftServeInstance<Options extends object> extends EventEmitter<
  ConvertValuesToArray<Events>
> {
  readonly _routesMap: Map<string, Route<string, Method>>;
  readonly _middlewares = new Set<MiddlewareFn>();
  readonly _serverOptions: Options & HttpServeOptions;
  private server: Server | undefined;

  constructor(options: HttpServeOptions) {
    super();
    this._routesMap = new Map();
    this._serverOptions = { port: 3000 } as Options & HttpServeOptions;
    Object.assign(this._serverOptions, options || {});
  }

  get routes() {
    return this._routesMap;
  }

  get middlewares() {
    return this._middlewares;
  }

  setOptions(options: Partial<Options>): this;
  setOptions(options: Partial<HttpServeOptions>): this;
  setOptions(options: Partial<object>): this;
  setOptions(options: Partial<Options | HttpServeOptions>): this {
    Object.assign(this._serverOptions, options);
    return this;
  }

  setOption<T extends keyof Options>(key: T, value: Options[T]): this;
  setOption<T extends keyof HttpServeOptions>(key: T, value: HttpServeOptions[T]): this;
  setOption(key: string, value: any): this;
  setOption(key: string, value: any): this {
    this._serverOptions[key] = value;
    return this;
  }

  getOption<T extends keyof Options>(key: T): Options[T];
  getOption<T extends keyof HttpServeOptions>(key: T): HttpServeOptions[T];
  getOption(key: string): any;
  getOption(key: string): any {
    return this._serverOptions[key];
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

  use(middlewareOrPath: string | MiddlewareFn, ...middlewares: MiddlewareFn[]) {
    const route = typeof middlewareOrPath === "string" ? middlewareOrPath : "*";
    typeof middlewareOrPath === "function" && middlewares.unshift(middlewareOrPath);

    const addableMiddlewares = middlewares
      .filter(middleware => typeof middleware === "function" && !this._middlewares.has(middleware))
      .map(middleware => {
        this._middlewares.add(middleware);
        return middleware;
      });

    this.addRoute(route, "*", addableMiddlewares);

    return this;
  }

  serve(): Server {
    const self = this;

    this.server = Bun.serve({
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
        const body = req.method === "GET" ? undefined : await req.text();

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

    this._serverOptions.callback?.(this.server);

    return this.server;
  }

  close(hard = false) {
    if (!this.server) {
      return;
    }

    this.server.stop(hard);
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
