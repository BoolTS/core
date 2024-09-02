import * as Zod from "zod";
import { controllerRouteZodSchemaKey } from "../keys";

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
