import { parse } from "qs";

import { UrlencodedFn } from "../types";
import { limitParser } from "../utils";

export const urlencoded: UrlencodedFn = options => {
  const { extended = true, limit = "1mb", parameterLimit = 1000, type, verify } = options || {};

  return (req: any, _res: any) => {
    if (!req.body) return;
    if (typeof req.body !== "string") return;
    if (req.body.length > limitParser(limit)) {
      throw new Error("Body exceeds limit");
    }
    if (verify) {
      verify(req, _res, Buffer.from(req.body), "utf8");
    }

    req.body = parse(req.body, {
      parameterLimit,
      parseArrays: extended,
      ...(type
        ? {
            allowPrototypes:
              typeof type === "function"
                ? type(req) instanceof Array
                : type instanceof Array
                ? type.includes(req.header("content-type"))
                : req.header("content-type") === type
          }
        : {})
    });
  };
};
