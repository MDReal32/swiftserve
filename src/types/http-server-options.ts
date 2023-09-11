import { ServeOptions, TLSServeOptions, UnixServeOptions, UnixTLSServeOptions } from "bun";

export type HttpServeOptions = (
  | Omit<ServeOptions, "fetch">
  | Omit<TLSServeOptions, "fetch">
  | Omit<UnixServeOptions, "fetch">
  | Omit<UnixTLSServeOptions, "fetch">
) & { singleton?: boolean };
