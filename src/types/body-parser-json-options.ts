import { SwiftRequest, SwiftResponse } from "../extends";

export interface BodyParserJsonOptions {
  inflate?: boolean;
  limit?: number | string;
  reviver?: Parameters<typeof JSON.parse>[1];
  strict?: boolean;
  type?: string | string[] | ((req: SwiftRequest) => string[]);
  verify?: (req: SwiftRequest, res: SwiftResponse, buf: Buffer, encoding: string) => void;
}
