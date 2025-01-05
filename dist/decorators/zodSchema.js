import * as Zod from "zod";
import { zodSchemaKey } from "../keys";
export const ZodSchema = (schema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const zodSchemasMetadata = Reflect.getOwnMetadata(zodSchemaKey, target.constructor, methodName) || {};
        zodSchemasMetadata[`paramterIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            schema: schema
        };
        Reflect.defineMetadata(zodSchemaKey, zodSchemasMetadata, target.constructor, methodName);
    };
};
