export const isWebSocketUpgrade = (request) => {
    const headers = request.headers;
    const method = request.method;
    const upgrade = headers.get("upgrade")?.toLowerCase() || "";
    const connection = headers.get("connection")?.toLowerCase() || "";
    return method === "GET" && upgrade?.toLowerCase() === "websocket" && connection?.toLowerCase().includes("upgrade");
};
