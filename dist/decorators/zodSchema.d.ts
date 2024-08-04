import * as Zod from "zod";
export declare const controllerRouteZodSchemaKey: unique symbol;
export declare const ZodSchema: (schema: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
