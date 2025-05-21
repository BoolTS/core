import type { TWebsocketArgumentsMetadata } from "./webSocketArguments";
export type TWebSocketEventHandlerMetadata = Required<{
    methodName: string;
    descriptor: PropertyDescriptor;
}> & Partial<{
    arguments: Record<string, TWebsocketArgumentsMetadata>;
}>;
export type TWebSocketEventMetadata = Record<"open" | "close" | "message" | "drain" | "ping" | "pong", TWebSocketEventHandlerMetadata>;
/**
 *
 * @param path
 * @returns
 */
export declare const WebSocketEvent: <T extends Object>(eventName: "open" | "close" | "message" | "drain" | "ping" | "pong") => (target: T, methodName: string, descriptor: PropertyDescriptor) => void;
export default WebSocket;
