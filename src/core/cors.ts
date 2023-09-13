import { CorsFn } from "../types";

export const cors: CorsFn = (options?) => {
  return (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,Content-Length,Authorization,Accept,X-Requested-With"
    );
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", "SwiftServe");
    res.header("Server", "SwiftServe");

    if (req.method === "OPTIONS") {
      res.send(200);
    }
  };
};
