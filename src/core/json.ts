import { SwiftRequest, SwiftResponse } from "../extends";
import { BodyParserJsonOptions } from "../types";
import { limitParser } from "../utils";

export const json = (options?: BodyParserJsonOptions) => {
  const { limit = "1mb", strict = true, reviver, type, verify } = options || {};

  return (req: SwiftRequest, _res: SwiftResponse) => {
    if (!req.body) return;
    if (typeof req.body !== "string") return;
    if (req.body.length > limitParser(limit)) {
      throw new Error("Body exceeds limit");
    }
    if (verify) {
      verify(req, _res, Buffer.from(req.body), "utf8");
    }

    if (strict) {
      const first = req.body[0];
      if (first !== "{" && first !== "[") {
        throw new Error("Invalid JSON, must start with [{");
      }
    }

    if (!type) {
    } else if (typeof type === "function") {
      if (!(type(req) instanceof Array)) {
        throw new Error("Request type isn't an array");
      }
    } else if (type instanceof Array) {
      if (!type.includes(req.header("content-type"))) {
        throw new Error("Request type isn't in array");
      }
    } else if (req.header("content-type") !== type) {
      throw new Error("Request type isn't equal");
    }

    req.body = JSON.parse(req.body, reviver);
  };
};
