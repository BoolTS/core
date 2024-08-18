import * as Zod from "zod";
export declare enum EArgumentTypes {
    requestHeaders = "REQUEST_HEADERS",
    body = "BODY",
    params = "PARAMS",
    param = "PARAM",
    query = "QUERY",
    request = "REQUEST",
    responseHeaders = "RESPONSE_HEADERS"
}
export type TArgumentsMetadata = {
    index: number;
    type: EArgumentTypes.requestHeaders;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: EArgumentTypes.body;
    zodSchema?: Zod.Schema;
    parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text";
} | {
    index: number;
    type: EArgumentTypes.params;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: EArgumentTypes.param;
    key: string;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: EArgumentTypes.query;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: EArgumentTypes.request;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: EArgumentTypes.responseHeaders;
    zodSchema?: Zod.Schema;
};
export declare const argumentsKey: unique symbol;
export declare const RequestHeaders: (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Body: (zodSchema?: Zod.Schema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Params: (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Param: (key: string, zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Query: (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Request: (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const ResponseHeaders: (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
