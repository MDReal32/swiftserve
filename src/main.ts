import { swiftserve } from "./core";
import { CreateFn } from "./types";

declare module "bun" {
  export let create: CreateFn;
}

Bun.create = swiftserve;

export { SwiftServeInstance, cors, serveStatic, swiftserve } from "./core";
export { SwiftRequest, SwiftResponse } from "./extends";
export * from "./types";
export default swiftserve;
