import type { ServerWebSocket } from "bun";
import type { TWebSocketUpgradeData } from "./decorators/webSocket";

import {
    WebSocket,
    WebSocketCloseReason,
    WebSocketConnection,
    WebSocketEvent,
    WebSocketServer
} from "../src";

@WebSocket()
export class TestWebSocket {
    private _test = "123";

    @WebSocketEvent("open")
    openHandler(
        @WebSocketServer()
        server: any,
        @WebSocketConnection()
        connection: any
    ) {
        console.log("this.openHandler", server);
    }

    @WebSocketEvent("close")
    closeHandler(
        @WebSocketServer()
        server: any,
        @WebSocketConnection()
        connection: ServerWebSocket<TWebSocketUpgradeData>,
        @WebSocketCloseReason()
        closeReason: string
    ) {
        console.log("this.closeHandler", closeReason);
    }
}
