import { Method } from "bun";

import { FetchParamsFromPath } from "../types";

export class SwiftRequest<
  TPath extends string = string,
  TParams extends Record<string, string> = FetchParamsFromPath<TPath>,
  TQuery extends Record<string, string> = Record<string, string>,
  TBody = unknown,
  THeaders extends Record<string, string> = Record<string, string>
> {
  readonly pathname: string;
  readonly username: string;
  readonly password: string;
  readonly host: string;
  readonly hostname: string;
  readonly port: string;
  readonly origin: string;
  readonly protocol: string;

  constructor(
    readonly path: TPath,
    readonly method: Method,
    readonly params?: TParams,
    readonly query?: TQuery,
    readonly body?: TBody,
    readonly headers?: THeaders
  ) {
    const url = new URL(path);
    this.pathname = url.pathname;
    this.username = url.username;
    this.password = url.password;
    this.host = url.host;
    this.hostname = url.hostname;
    this.port = url.port;
    this.origin = url.origin;
    this.protocol = url.protocol;
  }
}