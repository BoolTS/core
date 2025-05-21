import * as Zod from "zod";
export declare const ZodSchema: <T extends Object>(schema: Zod.Schema) => (target: T, methodName: string | symbol | undefined, parameterIndex: number) => void;
