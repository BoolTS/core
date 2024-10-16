import type { IMiddleware } from "../interfaces";
import type { IDispatcher } from "../interfaces/dispatcher";
import "colors";
import "reflect-metadata";
import Qs from "qs";
import * as Zod from "zod";
import { RouterGroup } from "../entities";
import { Injector } from "./injector";
export type TGroupElementModel<TFuncName extends keyof TClass, TClass extends Object = Object, TFunc = TClass[TFuncName]> = Readonly<{
    class: TClass;
    func: TFunc;
    funcName: TFuncName;
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
export declare const responseConverter: (response: Response) => Response;
export declare const controllerCreator: (controllerConstructor: new (...args: any[]) => unknown, group: RouterGroup, injector: Injector, prefix?: string) => RouterGroup;
export declare const argumentsResolution: (data: unknown, zodSchema: Zod.Schema, argumentIndex: number, funcName: string | symbol) => Promise<any>;
export declare const moduleResolution: (module: new (...args: any[]) => unknown, options: TBoolFactoryOptions) => Promise<Readonly<{
    prefix: string | undefined;
    injector: Injector;
    startMiddlewareGroup: Readonly<{
        class: IMiddleware<any, any>;
        func: (...args: any[]) => any;
        funcName: "start";
    }>[];
    endMiddlewareGroup: Readonly<{
        class: IMiddleware<any, any>;
        func: (...args: any[]) => any;
        funcName: "end";
    }>[];
    guardGroup: Readonly<{
        class: new (...args: any[]) => any;
        funcName: "enforce";
        func: any;
    }>[];
    openDispatcherGroup: Readonly<{
        class: IDispatcher<any, any>;
        func: (...args: any[]) => any;
        funcName: "open";
    }>[];
    closeDispatcherGroup: Readonly<{
        class: IDispatcher<any, any>;
        func: (...args: any[]) => any;
        funcName: "close";
    }>[];
    routerGroup: RouterGroup;
}> | undefined>;
export declare const BoolFactory: (modules: Object | Array<Object>, options: TBoolFactoryOptions) => Promise<void>;
export default BoolFactory;
