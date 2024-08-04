import * as Zod from "zod";
export var EArgumentTypes;
(function (EArgumentTypes) {
    EArgumentTypes["headers"] = "HEADERS";
    EArgumentTypes["body"] = "BODY";
    EArgumentTypes["params"] = "PARAMS";
    EArgumentTypes["param"] = "PARAM";
    EArgumentTypes["query"] = "QUERY";
    EArgumentTypes["request"] = "REQUEST";
})(EArgumentTypes || (EArgumentTypes = {}));
export const controllerActionArgumentsKey = Symbol.for("__bool:controller.action::arguments__");
export const Headers = (zodSchema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const headersMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};
        headersMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.headers,
            zodSchema: zodSchema
        };
        Reflect.defineMetadata(controllerActionArgumentsKey, headersMetadata, target.constructor, methodName);
    };
};
export const Body = (zodSchema, parser) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const bodyMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};
        bodyMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.body,
            zodSchema: zodSchema,
            parser: parser
        };
        Reflect.defineMetadata(controllerActionArgumentsKey, bodyMetadata, target.constructor, methodName);
    };
};
export const Params = (zodSchema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const paramsMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};
        paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.params,
            zodSchema: zodSchema
        };
        Reflect.defineMetadata(controllerActionArgumentsKey, paramsMetadata, target.constructor, methodName);
    };
};
export const Param = (key, zodSchema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const paramsMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};
        paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.param,
            key: key,
            zodSchema: zodSchema
        };
        Reflect.defineMetadata(controllerActionArgumentsKey, paramsMetadata, target.constructor, methodName);
    };
};
export const Query = (zodSchema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const queryMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};
        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.params,
            zodSchema: zodSchema
        };
        Reflect.defineMetadata(controllerActionArgumentsKey, queryMetadata, target.constructor, methodName);
    };
};
export const Request = (zodSchema) => {
    return (target, methodName, parameterIndex) => {
        if (!methodName) {
            return;
        }
        const queryMetadata = Reflect.getOwnMetadata(controllerActionArgumentsKey, target.constructor, methodName) || {};
        queryMetadata[`argumentIndexes.${parameterIndex}`] = {
            index: parameterIndex,
            type: EArgumentTypes.request,
            zodSchema: zodSchema
        };
        Reflect.defineMetadata(controllerActionArgumentsKey, queryMetadata, target.constructor, methodName);
    };
};
