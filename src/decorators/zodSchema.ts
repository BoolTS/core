import * as Zod from "zod";

export const controllerRouteZodSchemaKey = "__bool:controller.route.zodSchema__";

export const ZodSchema = (
    schema: Zod.Schema
) => {
    try {
        schema.safeParse(undefined);
    }
    catch (err) {
        throw Error("Zod schema parameter do not allow async.");
    }

    return (
        target: Object,
        methodName: string | symbol | undefined,
        parameterIndex: number
    ) => {
        if (!methodName) {
            return;
        }

        const zodSchemasMetadata = Reflect.getOwnMetadata(controllerRouteZodSchemaKey, target.constructor, methodName) || {};

        zodSchemasMetadata[`paramterIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            schema: schema
        };

        Reflect.defineMetadata(controllerRouteZodSchemaKey, zodSchemasMetadata, target.constructor, methodName);
    }
}