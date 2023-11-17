/// <reference path="../bun.d.ts" />
import { swiftserve } from "./core";

Bun.create = swiftserve;

export { SwiftServeInstance, cors, serveStatic, swiftserve } from "./core";
export { SwiftRequest, SwiftResponse } from "./extends";
export * from "./types";

export default swiftserve;
