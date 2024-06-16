"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodSchema = exports.controllerRouteZodSchemaKey = void 0;
exports.controllerRouteZodSchemaKey = "__bool:controller.route.zodSchema__";
const ZodSchema = (schema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const zodSchemasMetadata = Reflect.getOwnMetadata(exports.controllerRouteZodSchemaKey, target.constructor, methodName) || {};
        zodSchemasMetadata[`paramterIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            schema: schema
        };
        Reflect.defineMetadata(exports.controllerRouteZodSchemaKey, zodSchemasMetadata, target.constructor, methodName);
    };
};
exports.ZodSchema = ZodSchema;
