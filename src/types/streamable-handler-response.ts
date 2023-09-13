export interface StreamableHandlerResponse {
  destroyed: boolean;
  headersSent: boolean;
  statusCode: number;
  send: (body: string) => void;
  end: () => void;
}
