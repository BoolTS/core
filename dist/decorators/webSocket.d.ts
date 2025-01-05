import type { IWebSocket } from "../interfaces";
import type { TWebSocketEventMetadata } from "./webSocketEvent";
export type TWebSocketHttpRouteMetadata = {
    path: string;
    httpMethod: "GET" | "POST";
    methodName: symbol;
    descriptor: PropertyDescriptor;
};
export type TWebSocketUpgradeData = {
    pathname: string;
    method: string;
    query: Record<string, unknown>;
};
export type TWebSocketHttpMetadata = TWebSocketHttpRouteMetadata[];
export type TWebSocketMetadata = Required<{
    prefix: string;
    events: TWebSocketEventMetadata;
    http: TWebSocketHttpMetadata;
}>;
export declare const WebSocket: (args?: Partial<{
    prefix: string;
}>) => <T extends {
    new (...args: any[]): IWebSocket;
}>(target: T) => void;
export default WebSocket;
