// src/server.ts
import { WebSocket, WebSocketServer } from "ws";
import express from "express";
import http from "http";

const app = express();
app.use(express.json());
const PORT = 5000;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server instance
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Create a set to store client connections
const clients = new Set<WebSocket>();

wss.on("connection", (ws: WebSocket) => {
  clients.add(ws);
  console.log("Client connected");

  ws.on("close", () => {
    clients.delete(ws);
  });
});

app.post("/webhook", (req, res) => {
  console.log("Received webhook:", req.body);

  clients.forEach((ws) => {
    ws.send(JSON.stringify(req.body));
  });

  res.status(200).send("OK");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
