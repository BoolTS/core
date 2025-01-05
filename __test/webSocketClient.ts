const socket = new WebSocket("http://localhost:3000");

// Connection opened
socket.addEventListener("open", (event) => {
    socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
});

socket.addEventListener("open", () => {
    socket.send("Hello mother fucker");
});

socket.addEventListener("close", () => {
    socket.send("Hello mother fucker 1");
});

socket.addEventListener("error", () => {
    console.error("Hello mother fucker 2");
});
