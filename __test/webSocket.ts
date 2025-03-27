import type { TWebSocketUpgradeData } from "@dist";
import type { Server, ServerWebSocket } from "bun";

import {
    WebSocket,
    WebSocketCloseCode,
    WebSocketCloseReason,
    WebSocketConnection,
    WebSocketEvent,
    WebSocketMessage,
    WebSocketServer
} from "@dist";

@WebSocket()
export class TestWebSocket {
    @WebSocketEvent("open")
    onOpen(
        @WebSocketServer()
        server: Server,
        @WebSocketConnection()
        connection: ServerWebSocket<TWebSocketUpgradeData>
    ) {
        console.log("this.openHandler", server);
    }

    @WebSocketEvent("close")
    onClose(
        @WebSocketServer()
        server: Server,
        @WebSocketConnection()
        connection: ServerWebSocket<TWebSocketUpgradeData>,
        @WebSocketCloseCode()
        closeCode: number,
        @WebSocketCloseReason()
        closeReason: string
    ) {
        console.log("this.closeHandler", closeReason);
    }

    @WebSocketEvent("message")
    onMessage(
        @WebSocketServer()
        server: Server,
        @WebSocketConnection()
        connection: ServerWebSocket<TWebSocketUpgradeData>,
        @WebSocketMessage()
        message: string | Buffer
    ) {}

    @WebSocketEvent("ping")
    onPing(
        @WebSocketServer()
        server: Server,
        @WebSocketConnection()
        connection: ServerWebSocket<TWebSocketUpgradeData>,
        @WebSocketMessage()
        message: Buffer
    ) {}

    @WebSocketEvent("pong")
    onPong(
        @WebSocketServer()
        server: Server,
        @WebSocketConnection()
        connection: ServerWebSocket<TWebSocketUpgradeData>,
        @WebSocketMessage()
        message: Buffer
    ) {}

    @WebSocketEvent("drain")
    onDrain(
        @WebSocketServer()
        server: Server,
        @WebSocketConnection()
        connection: ServerWebSocket<TWebSocketUpgradeData>
    ) {
        console.log("this.drainHandler");
    }
}
