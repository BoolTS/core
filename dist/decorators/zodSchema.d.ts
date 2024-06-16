import * as Zod from "zod";
export declare const controllerRouteZodSchemaKey = "__bool:controller.route.zodSchema__";
export declare const ZodSchema: (schema: Zod.Schema) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
