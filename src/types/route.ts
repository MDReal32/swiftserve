import { Method } from "./method";
import { Middleware } from "./middleware";

export interface Route<TPath extends string, TMethod extends Method> {
  path: TPath;
  middlewares: Middleware<TPath, TMethod>[];
}
