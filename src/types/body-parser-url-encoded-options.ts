import { SwiftRequest, SwiftResponse } from "../extends";

export interface BodyParserUrlEncodedOptions {
  extended?: boolean;
  limit?: number | string;
  parameterLimit?: number;
  type?: string | string[] | ((req: SwiftRequest) => string[]);
  verify?: (req: SwiftRequest, res: SwiftResponse, buf: Buffer, encoding: string) => void;
}
