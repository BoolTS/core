import * as Zod from "zod";

export const controllerRouteZodSchemaKey = Symbol.for("__bool:controller.route.zodSchema__");

export const ZodSchema = (schema: Zod.Schema) => {
    return (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => {
        if (!methodName) {
            return;
        }

        const zodSchemasMetadata = Reflect.getOwnMetadata(controllerRouteZodSchemaKey, target.constructor, methodName) || {};

        zodSchemasMetadata[`paramterIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            schema: schema
        };

        Reflect.defineMetadata(controllerRouteZodSchemaKey, zodSchemasMetadata, target.constructor, methodName);
    };
};
