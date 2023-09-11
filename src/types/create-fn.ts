import { BunServerInstance } from "./bun-server-instance";
import { HttpServeOptions } from "./http-server-options";

export type CreateFn = (options?: HttpServeOptions) => BunServerInstance;
