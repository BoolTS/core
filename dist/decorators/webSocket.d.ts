import type { TConstructor } from "../ultils";
import type { TArgumentsMetadataCollection } from "./arguments";
import type { TWebSocketEventMetadata } from "./webSocketEvent";
export type TWebSocketHttpRouteMetadata = {
    path: string;
    httpMethod: "GET" | "POST";
    methodName: symbol;
    descriptor: PropertyDescriptor;
    argumentsMetadata: TArgumentsMetadataCollection;
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
export declare const WebSocket: <T extends TConstructor<Object>>(args?: Partial<{
    prefix: string;
}>) => (target: T) => void;
export default WebSocket;
