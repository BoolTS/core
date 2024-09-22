import * as Zod from "zod";
import { contextArgsKey, paramArgsKey, paramsArgsKey, queryArgsKey, requestArgsKey, requestBodyArgsKey, requestHeaderArgsKey, requestHeadersArgsKey, responseHeadersArgsKey, routeModelArgsKey } from "../keys";
export type TArgumentsMetadata = {
    index: number;
    type: typeof requestHeadersArgsKey;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: typeof requestHeaderArgsKey;
    key: string;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: typeof requestBodyArgsKey;
    zodSchema?: Zod.Schema;
    parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text";
} | {
    index: number;
    type: typeof paramsArgsKey;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: typeof paramArgsKey;
    key: string;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: typeof queryArgsKey;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: typeof requestArgsKey;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: typeof responseHeadersArgsKey;
} | {
    index: number;
    type: typeof contextArgsKey;
    key?: symbol;
} | {
    index: number;
    type: typeof routeModelArgsKey;
};
export declare const RequestHeaders: (schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const RequestHeader: (key: string, schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const RequestBody: (schema?: Zod.Schema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Params: (schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Param: (key: string, schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Query: (schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Request: (schema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const ResponseHeaders: () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Context: (key?: symbol) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const RouteModel: () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
