import type {
    TWebsocketArgumentsMetadata,
    TWebsocketArgumentsMetadataGroup
} from "./webSocketArguments";

import { webSocketEventArgumentsKey, webSocketEventKey } from "../constants/keys";

export type TWebSocketEventHandlerMetadata = Required<{
    methodName: string;
    descriptor: PropertyDescriptor;
}> &
    Partial<{
        arguments: Record<string, TWebsocketArgumentsMetadata>;
    }>;

export type TWebSocketEventMetadata = Record<
    "open" | "close" | "message" | "drain" | "ping" | "pong",
    TWebSocketEventHandlerMetadata
>;

/**
 *
 * @param path
 * @returns
 */
export const WebSocketEvent =
    <T extends Object>(eventName: "open" | "close" | "message" | "drain" | "ping" | "pong") =>
    (target: T, methodName: string, descriptor: PropertyDescriptor) => {
        if (!(descriptor.value instanceof Function)) {
            throw Error("WebSocketEvent decorator only use for class's method.");
        }

        const webSocketEventArgumentsMetadata: TWebsocketArgumentsMetadataGroup | undefined =
            Reflect.getOwnMetadata(webSocketEventArgumentsKey, target.constructor, methodName);

        const webSocketEventMetadata: TWebSocketEventHandlerMetadata = Object.freeze({
            methodName: methodName,
            descriptor: descriptor,
            arguments: webSocketEventArgumentsMetadata
        });

        const webSocketMetadata: TWebSocketEventMetadata = {
            ...(Reflect.getOwnMetadata(webSocketEventKey, target.constructor) || undefined),
            [eventName]: webSocketEventMetadata
        };

        Reflect.defineMetadata(
            webSocketEventKey,
            webSocketEventMetadata,
            target.constructor,
            methodName
        );
        Reflect.defineMetadata(webSocketEventKey, webSocketMetadata, target.constructor);
    };

export default WebSocket;
