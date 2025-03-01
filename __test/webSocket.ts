import type { ServerWebSocket } from "bun";
import type { TWebSocketUpgradeData } from "../dist/decorators/webSocket";

import {
    WebSocket,
    WebSocketCloseReason,
    WebSocketConnection,
    WebSocketEvent,
    WebSocketServer
} from "@dist";

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
