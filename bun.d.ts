import type { CreateFn } from "./src/types";

declare module "bun" {
  export let create: CreateFn;
}
