import Controller from "./controller";

export type MethodRouteMap = {
  [key: string]: { method: string; callback: string; type: typeof Controller };
};

export type RpcParameters =
  | {
      [key: string]: any;
    }
  | any[];

export type JsonApiOperation = {
  op: string;
  data?: any;
  included?: any[];
  ref: {
    type: string;
    id?: string | undefined;
    lid?: string;
    relationship?: string;
  };
  params?: any;
  links?: any;
  meta?: any;
};

export type JsonRpcProtocolV2 = {
  jsonrpc: "2.0";
};

export type JsonRpc = JsonRpcProtocolV2 & {
  method: string;
  params?: RpcParameters;
  id: number;
};

export type JsonRpcNotification = JsonRpcProtocolV2 & {
  result: any;
};
export type JsonRpcResponse = JsonRpcNotification & {
  id: number;
};

export type JsonRpcError = JsonRpcProtocolV2 & {
  jsonrpc: string;
  error: {
    code: number;
    message: string;
    data: any;
  };
};

export type Rpc = {
  methodName: string;
  parameters: RpcParameters;
  id?: number;
};
