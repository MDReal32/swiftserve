import { ServeStaticFn } from "../types";

export const serveStatic: ServeStaticFn = (path, options?) => {
  return (req, res) => {
    const url = new URL(req.url);
    const filePath = url.pathname.replace(options?.prefix || "", "");
    return res.file(`${path}${filePath}`);
  };
};
