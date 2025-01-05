import { webSocketCloseCodeArgsKey, webSocketCloseReasonArgsKey, webSocketConnectionArgsKey, webSocketEventArgumentsKey, webSocketMessageArgsKey, webSocketServerArgsKey } from "../keys";
export const WebSocketConnection = () => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const webSocketEventArgumentsMetadata = Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) ||
        {};
    webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: webSocketConnectionArgsKey
    };
    Reflect.defineMetadata(webSocketEventArgumentsKey, webSocketEventArgumentsMetadata, target.constructor, methodName);
};
export const WebSocketServer = () => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const webSocketEventArgumentsMetadata = Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) ||
        {};
    webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: webSocketServerArgsKey
    };
    Reflect.defineMetadata(webSocketEventArgumentsKey, webSocketEventArgumentsMetadata, target.constructor, methodName);
};
export const WebSocketCloseCode = () => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const webSocketEventArgumentsMetadata = Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) ||
        {};
    webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: webSocketCloseCodeArgsKey
    };
    Reflect.defineMetadata(webSocketEventArgumentsKey, webSocketEventArgumentsMetadata, target.constructor, methodName);
};
export const WebSocketCloseReason = () => (target, methodName, parameterIndex) => {
    if (!methodName) {
        return;
    }
    const webSocketEventArgumentsMetadata = Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName) ||
        {};
    webSocketEventArgumentsMetadata[`argumentIndexes.${parameterIndex}`] = {
        index: parameterIndex,
        type: webSocketCloseReasonArgsKey
    };
    Reflect.defineMetadata(webSocketEventArgumentsKey, webSocketEventArgumentsMetadata, target.constructor, methodName);
};
