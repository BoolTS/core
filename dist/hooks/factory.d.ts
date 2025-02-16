import type { TArgumentsMetadataCollection } from "../decorators/arguments";
import "reflect-metadata";
import Qs from "qs";
export type TGroupElementModel<TFuncName extends keyof TClass, TClass extends Object = Object, TFunc = TClass[TFuncName]> = Readonly<{
    class: TClass;
    func: TFunc;
    funcName: TFuncName;
    argumentsMetadata: TArgumentsMetadataCollection;
}>;
export type TBoolFactoryOptions = Required<{
    port: number;
}> & Partial<{
    config: Record<string | symbol, any> | (() => Record<string | symbol, any>);
    prefix: string;
    debug: boolean;
    log: Partial<{
        methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
    }>;
    queryParser: Parameters<typeof Qs.parse>[1];
    static: Required<{
        path: string;
    }> & Partial<{
        headers: Record<string, string>;
        cacheTimeInSeconds: number;
    }>;
    cors: Partial<{
        credentials: boolean;
        origins: string | Array<string>;
        methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
        headers: Array<string>;
    }>;
}>;
export declare const BoolFactory: (modules: Object | Array<Object>, options: TBoolFactoryOptions) => Promise<void>;
export default BoolFactory;
