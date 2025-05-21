import * as Zod from "zod";
import { contextArgsKey, httpServerArgsKey, paramArgsKey, paramsArgsKey, queryArgsKey, requestArgsKey, requestBodyArgsKey, requestHeaderArgsKey, requestHeadersArgsKey, responseHeadersArgsKey, routeModelArgsKey } from "../keys";
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
} | {
    index: number;
    type: typeof httpServerArgsKey;
};
export type TArgumentsMetadataCollection = Record<`argumentIndexes.${number}`, TArgumentsMetadata>;
export declare const RequestHeaders: <T extends Object>(schema?: Zod.Schema) => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const RequestHeader: <T extends Object>(key: string, schema?: Zod.Schema) => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const RequestBody: <T extends Object>(schema?: Zod.Schema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Params: <T extends Object>(schema?: Zod.Schema) => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Param: <T extends Object>(key: string, schema?: Zod.Schema) => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Query: <T extends Object>(schema?: Zod.Schema) => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Request: <T extends Object>(schema?: Zod.Schema) => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const ResponseHeaders: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Context: <T extends Object>(key?: symbol) => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const RouteModel: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const HttpServer: <T extends Object>() => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
