import * as Zod from "zod";
import { argumentsKey, bodyArgsKey, contextArgsKey, paramArgsKey, paramsArgsKey, queryArgsKey, requestArgsKey, requestHeadersArgsKey, responseHeadersArgsKey } from "../keys";
export const RequestHeaders = (zodSchema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const requestHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    requestHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: requestHeadersArgsKey,
        zodSchema: zodSchema
    };
    Reflect.defineMetadata(argumentsKey, requestHeadersMetadata, target.constructor, methodName);
};
export const Body = (zodSchema, parser) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const bodyMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    bodyMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: bodyArgsKey,
        zodSchema: zodSchema,
        parser: parser
    };
    Reflect.defineMetadata(argumentsKey, bodyMetadata, target.constructor, methodName);
};
export const Params = (zodSchema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const paramsMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    paramsMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: paramsArgsKey,
        zodSchema: zodSchema
    };
    Reflect.defineMetadata(argumentsKey, paramsMetadata, target.constructor, methodName);
};
export const Param = (key, zodSchema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const paramMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    paramMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: paramArgsKey,
        key: key,
        zodSchema: zodSchema
    };
    Reflect.defineMetadata(argumentsKey, paramMetadata, target.constructor, methodName);
};
export const Query = (zodSchema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const queryMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    queryMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: queryArgsKey,
        zodSchema: zodSchema
    };
    Reflect.defineMetadata(argumentsKey, queryMetadata, target.constructor, methodName);
};
export const Request = (zodSchema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const requestMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    requestMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: requestArgsKey,
        zodSchema: zodSchema
    };
    Reflect.defineMetadata(argumentsKey, requestMetadata, target.constructor, methodName);
};
export const ResponseHeaders = (zodSchema) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: responseHeadersArgsKey,
        zodSchema: zodSchema
    };
    Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};
export const Context = (injectKey) => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const responseHeadersMetadata = Reflect.getOwnMetadata(argumentsKey, target.constructor, methodName) || {};
    responseHeadersMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: contextArgsKey,
        injectKey: injectKey
    };
    Reflect.defineMetadata(argumentsKey, responseHeadersMetadata, target.constructor, methodName);
};
