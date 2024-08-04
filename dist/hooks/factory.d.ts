import "colors";
import "reflect-metadata";
import Qs from "qs";
import * as Zod from "zod";
import { RouterGroup } from "../entities";
export type TBoolFactoryOptions = Required<{
    port: number;
}> & Partial<{
    prefix: string;
    debug: boolean;
    log: Partial<{
        methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
    }>;
    queryParser: Parameters<typeof Qs.parse>[1];
}>;
export declare const controllerCreator: (controllerConstructor: new (...args: any[]) => unknown, group: RouterGroup) => RouterGroup;
export declare const controllerActionArgumentsResolution: (data: unknown, zodSchema: Zod.Schema, argumentIndex: number, funcName: string | symbol) => Promise<any>;
export declare const BoolFactory: (target: new (...args: any[]) => unknown, options: TBoolFactoryOptions) => void;
export default BoolFactory;
