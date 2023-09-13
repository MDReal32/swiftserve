import { Readable } from "node:stream";

import { StreamableHandlerResponse } from "../types";

export class SwiftResponse implements StreamableHandlerResponse {
  private _status: number = 200;
  private _statusText: string = "OK";
  private _headers: Record<string, string> = {};
  private _isHeadersSent: boolean = false;
  private _isDestroyed: boolean = false;

  get statusCode() {
    return this._status;
  }

  get headersSent() {
    return this._isHeadersSent;
  }

  get destroyed() {
    return this._isDestroyed;
  }

  redirect(url: string): Response {
    return this.status(302, "Redirect").header("Location", url).send();
  }

  status(status: number, statusText?: string): this {
    this._status = status;

    if (status >= 100 && status < 200) {
      this._statusText = statusText || "Continue";
    } else if (status >= 200 && status < 300) {
      this._statusText = statusText || "OK";
    } else if (status >= 300 && status < 400) {
      this._statusText = statusText || "Redirect";
    } else if (status >= 400 && status < 500) {
      this._statusText = statusText || "Client Error";
    } else if (status >= 500 && status < 600) {
      this._statusText = statusText || "Server Error";
    } else {
      this._statusText = statusText || "Unknown";
    }

    return this;
  }

  header(key: string): string | undefined;
  header(key: string, value: string | number | boolean): this;
  header(key: string, value?: string | number | boolean) {
    if (value === undefined) return this._headers[key];
    this._headers[key] = value.toString();
    return this;
  }

  file(
    path: string,
    options?: { root?: string; headers?: Record<string, string> } & BlobPropertyBag
  ): Response {
    const file = Bun.file(path, options);
    this.header("Content-Type", file.type);
    this.header("Content-Length", file.size);
    this.header("Content-Disposition", `attachment; filename="${file.name}"`);
    this.header("Last-Modified", file.lastModified);
    return this.stream(file.stream());
  }

  html(html: string): Response {
    this.header("Content-Type", "text/html");
    return this.send(html);
  }

  text(text: string): Response {
    this.header("Content-Type", "text/plain");
    return this.send(text);
  }

  json<TData>(data: TData): Response {
    this.header("Content-Type", "application/json");
    return this.send(JSON.stringify(data));
  }

  stream(stream: Readable | ReadableStream): Response {
    this.header("Content-Type", "application/octet-stream");

    if (stream instanceof Readable) {
      stream = new ReadableStream({
        start(controller) {
          (stream as Readable).on("data", chunk => {
            controller.enqueue(chunk);
          });

          (stream as Readable).on("end", () => {
            controller.close();
          });
        }
      });
    }

    return this.send(stream);
  }

  send(
    data?:
      | ReadableStream
      | BlobPart
      | BlobPart[]
      | FormData
      | URLSearchParams
      | string
      | number
      | boolean
      | null
  ): Response {
    const datum =
      typeof data === "string" || typeof data === "number" || typeof data === "boolean"
        ? data.toString()
        : data;

    const response = new Response(datum, {
      status: this._status,
      headers: this._headers,
      statusText: this._statusText
    });
    this._isHeadersSent = true;
    return response;
  }

  end(data?: ReadableStream | BlobPart | BlobPart[] | FormData | URLSearchParams | null) {
    this._isDestroyed = true;
    this.send(data);
  }
}
