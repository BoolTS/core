import { webSocketEventKey, webSocketKey } from "../keys";
const upgradeHandlerSymbol = Symbol("__bool:webSocket.upgrade__");
const upgradeHandler = (server, request, query) => {
    const url = new URL(request.url);
    return server.upgrade(request, {
        data: {
            method: request.method.toUpperCase(),
            pathname: url.pathname,
            query: query
        }
    });
};
export const WebSocket = (args) => (target) => {
    const { prefix } = args || {};
    target.prototype[upgradeHandlerSymbol] = upgradeHandler;
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, upgradeHandlerSymbol);
    const httpMetadata = !descriptor
        ? []
        : [
            {
                path: "/",
                httpMethod: "GET",
                methodName: upgradeHandlerSymbol,
                descriptor: descriptor
            },
            {
                path: "/",
                httpMethod: "POST",
                methodName: upgradeHandlerSymbol,
                descriptor: descriptor
            }
        ];
    const metadata = {
        prefix: !prefix?.startsWith("/") ? `/${prefix || ""}` : prefix,
        events: Reflect.getOwnMetadata(webSocketEventKey, target) || {},
        http: httpMetadata
    };
    Reflect.defineMetadata(webSocketKey, metadata, target);
};
export default WebSocket;
