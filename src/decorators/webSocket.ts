import type { Server } from "bun";
import type { IWebSocket } from "../interfaces";
import type { TArgumentsMetadataCollection } from "./arguments";
import type { TWebSocketEventMetadata } from "./webSocketEvent";

import { webSocketEventKey, webSocketKey } from "../keys";

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

const upgradeHandlerSymbol = Symbol("__bool:webSocket.upgrade__");

const upgradeHandler = (server: Server, request: Request, query: Record<string, unknown>) => {
    const url = new URL(request.url);

    return server.upgrade<TWebSocketUpgradeData>(request, {
        data: {
            method: request.method.toUpperCase(),
            pathname: url.pathname,
            query: query
        }
    });
};

export const WebSocket =
    (
        args?: Partial<{
            prefix: string;
        }>
    ) =>
    <T extends { new (...args: any[]): IWebSocket }>(target: T) => {
        const { prefix } = args || {};

        target.prototype[upgradeHandlerSymbol] = upgradeHandler;

        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, upgradeHandlerSymbol);

        const httpMetadata: TWebSocketHttpMetadata = !descriptor
            ? []
            : [
                  {
                      path: "/",
                      httpMethod: "GET",
                      methodName: upgradeHandlerSymbol,
                      descriptor: descriptor,
                      argumentsMetadata: {}
                  },
                  {
                      path: "/",
                      httpMethod: "POST",
                      methodName: upgradeHandlerSymbol,
                      descriptor: descriptor,
                      argumentsMetadata: {}
                  }
              ];

        const metadata: TWebSocketMetadata = {
            prefix: !prefix?.startsWith("/") ? `/${prefix || ""}` : prefix,
            events: Reflect.getOwnMetadata(webSocketEventKey, target) || {},
            http: httpMetadata
        };

        Reflect.defineMetadata(webSocketKey, metadata, target);
    };

export default WebSocket;
