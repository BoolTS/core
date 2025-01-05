import { webSocketEventArgumentsKey, webSocketEventKey } from "../keys";
/**
 *
 * @param path
 * @returns
 */
export const WebSocketEvent = (eventName) => (target, methodName, descriptor) => {
    if (!(descriptor.value instanceof Function)) {
        throw Error("WebSocketEvent decorator only use for class's method.");
    }
    const webSocketEventArgumentsMetadata = Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName);
    const webSocketEventMetadata = Object.freeze({
        methodName: methodName,
        descriptor: descriptor,
        arguments: webSocketEventArgumentsMetadata
    });
    const webSocketMetadata = {
        ...(Reflect.getOwnMetadata(webSocketEventKey, target.constructor) || undefined),
        [eventName]: webSocketEventMetadata
    };
    Reflect.defineMetadata(webSocketEventKey, webSocketEventMetadata, target.constructor, methodName);
    Reflect.defineMetadata(webSocketEventKey, webSocketMetadata, target.constructor);
};
export default WebSocket;
