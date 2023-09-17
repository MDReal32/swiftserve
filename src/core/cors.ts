import { promisify } from "util";

import "@total-typescript/ts-reset/filter-boolean";

import { CorsFn } from "../types";

export const cors: CorsFn = (options?) => {
  const {
    origin = "*",
    methods = "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders = "Content-Type,Authorization",
    exposedHeaders = "",
    credentials = false,
    maxAge = 86400,
    optionsSuccessStatus = 204,
    preflightContinue = false
  } = options || {};

  const originFn = typeof origin === "function" ? promisify(origin) : origin;
  const methodsString = Array.isArray(methods) ? methods.join(",") : methods;
  const allowedHeadersString = Array.isArray(allowedHeaders)
    ? allowedHeaders.join(",")
    : allowedHeaders;
  const exposedHeadersString = Array.isArray(exposedHeaders)
    ? exposedHeaders.join(",")
    : exposedHeaders;

  return async (req, res) => {
    const originValue = typeof originFn === "function" ? await originFn(req.url) : originFn;

    if (originValue === false) {
      return;
    }

    const regexOrigin = (regex: RegExp) => {
      if (regex.test(req.header("Origin"))) {
        return req.header("Origin");
      }
      return;
    };

    const stringOrigin = (string: string) => {
      if (string === "*" || string === req.header("Origin")) {
        return string;
      }
      return;
    };

    if (typeof originValue === "string" && originValue !== "*") {
      res.header("Access-Control-Allow-Origin", originValue);
    } else if (originValue instanceof RegExp) {
      res.header("Access-Control-Allow-Origin", regexOrigin(originValue));
    } else if (Array.isArray(originValue) && !originValue.includes("*")) {
      const origins = originValue
        .filter(value => typeof value === "string" || value instanceof RegExp)
        .map(value => {
          if (typeof value === "string") {
            return stringOrigin(value);
          } else {
            return regexOrigin(value);
          }
        })
        .filter(Boolean);

      if (origins.length > 0) {
        res.header("Access-Control-Allow-Origin", origins.join(","));
      }
    } else {
      res.header("Access-Control-Allow-Origin", "*");
    }

    res.header("Access-Control-Allow-Methods", methodsString);
    res.header("Access-Control-Allow-Headers", allowedHeadersString);
    res.header("Access-Control-Expose-Headers", exposedHeadersString);
    res.header("Access-Control-Allow-Credentials", credentials.toString());
    res.header("Access-Control-Max-Age", maxAge.toString());

    if (req.method === "OPTIONS") {
      if (preflightContinue) {
        return;
      }

      res.status(optionsSuccessStatus);
    }
  };
};
