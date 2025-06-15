import { contextArgsKey, httpServerArgsKey, paramArgsKey, paramsArgsKey, queryArgsKey, requestArgsKey, requestBodyArgsKey, requestHeaderArgsKey, requestHeadersArgsKey, responseHeadersArgsKey, routeModelArgsKey } from "../keys";
export type TArgumentsMetadata<TValidationSchema = unknown> = {
    index: number;
    type: typeof requestHeadersArgsKey;
    validationSchema?: TValidationSchema;
} | {
    index: number;
    type: typeof requestHeaderArgsKey;
    key: string;
    validationSchema?: TValidationSchema;
} | {
    index: number;
    type: typeof requestBodyArgsKey;
    validationSchema?: TValidationSchema;
    parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text";
} | {
    index: number;
    type: typeof paramsArgsKey;
    validationSchema?: TValidationSchema;
} | {
    index: number;
    type: typeof paramArgsKey;
    key: string;
    validationSchema?: TValidationSchema;
} | {
    index: number;
    type: typeof queryArgsKey;
    validationSchema?: TValidationSchema;
} | {
    index: number;
    type: typeof requestArgsKey;
    validationSchema?: TValidationSchema;
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
export declare const RequestHeaders: <TTarget extends Object, TValidationSchema = unknown>(validationSchema?: TValidationSchema) => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const RequestHeader: <TTarget extends Object, TValidationSchema = unknown>(key: string, validationSchema?: TValidationSchema) => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const RequestBody: <TTarget extends Object, TValidationSchema = unknown>(validationSchema?: TValidationSchema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Params: <TTarget extends Object, TValidationSchema = unknown>(validationSchema?: TValidationSchema) => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Param: <TTarget extends Object, TValidationSchema = unknown>(key: string, validationSchema?: TValidationSchema) => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Query: <TTarget extends Object, TValidationSchema = unknown>(validationSchema?: TValidationSchema) => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Request: <TTarget extends Object, TValidationSchema = unknown>(validationSchema?: TValidationSchema) => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const ResponseHeaders: <TTarget extends Object>() => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Context: <TTarget extends Object>(key?: symbol) => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const RouteModel: <TTarget extends Object>() => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const HttpServer: <TTarget extends Object>() => (target: TTarget, methodName: string | symbol | undefined, parameterIndex: number) => void;
