import * as Zod from "zod";
import { bodyArgsKey, contextArgsKey, paramArgsKey, paramsArgsKey, queryArgsKey, requestArgsKey, requestHeadersArgsKey, responseHeadersArgsKey } from "../keys";
export type TArgumentsMetadata = {
    index: number;
    type: typeof requestHeadersArgsKey;
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: typeof bodyArgsKey;
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
    zodSchema?: Zod.Schema;
} | {
    index: number;
    type: typeof contextArgsKey;
};
export declare const RequestHeaders: (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Body: (zodSchema?: Zod.Schema, parser?: "arrayBuffer" | "blob" | "formData" | "json" | "text") => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Params: (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Param: (key: string, zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Query: (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Request: (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const ResponseHeaders: (zodSchema?: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export declare const Context: () => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
