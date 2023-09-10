export class SwiftResponse {
  private _status: number = 200;
  private _statusText: string = "OK";
  private _headers: Record<string, string> = {};

  constructor() {}

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

  header(key: string, value: string): this {
    this._headers[key] = value;
    return this;
  }

  html(html: string): Response {
    this.header("Content-Type", "text/html");

    return new Response(html, {
      status: this._status,
      headers: this._headers,
      statusText: this._statusText
    });
  }

  text(text: string): Response {
    this.header("Content-Type", "text/plain");

    return new Response(text, {
      status: this._status,
      headers: this._headers,
      statusText: this._statusText
    });
  }

  json<TData>(data: TData): Response {
    this.header("Content-Type", "application/json");

    return Response.json(data, {
      status: this._status,
      headers: this._headers,
      statusText: this._statusText
    });
  }

  stream(stream: ReadableStream): Response {
    this.header("Content-Type", "application/octet-stream");

    return new Response(stream, {
      status: this._status,
      headers: this._headers,
      statusText: this._statusText
    });
  }
}