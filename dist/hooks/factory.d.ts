import "colors";
import "reflect-metadata";
import Qs from "qs";
import * as Zod from "zod";
import { RouterGroup } from "../entities";
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
}>;
export declare const controllerCreator: (controllerConstructor: new (...args: any[]) => unknown, group: RouterGroup, prefix?: string) => RouterGroup;
export declare const argumentsResolution: (data: unknown, zodSchema: Zod.Schema, argumentIndex: number, funcName: string | symbol) => Promise<any>;
export declare const BoolFactory: (target: new (...args: any[]) => unknown, options: TBoolFactoryOptions) => Promise<import("bun").Server | undefined>;
export default BoolFactory;
