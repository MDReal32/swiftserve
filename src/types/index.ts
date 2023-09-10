// convert '/users/:id/:name' to { id: string, name: string }
export type FetchParamsFromPath<TPath extends string> =
  TPath extends `${infer _Start}:${infer _Path}`
    ? _Path extends `${infer _Param}/${infer _Rest}`
      ? { [K in _Param]: string } & FetchParamsFromPath<_Rest>
      : _Path extends `${infer _Param}`
      ? { [K in _Param]: string }
      : {}
    : {};

export type NextFn = () => void;
