import WebSocket, { WebSocketServer } from 'ws';
import { wsConnectionSentType, wsDataMode, wsDataSentType } from '@repo/types'

const PORT = parseInt(process.env.PORT || "8080");

let admin: WebSocket | null = null;
let users: WebSocket[] = [];

const wss = new WebSocketServer({ port: PORT });

console.log("Start server on port 8080");
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    try {
      const body: wsDataMode = JSON.parse(data.toString());
      switch (body.type) {
        case "join-mode":
          handleJoinMode(ws, body);
          break;

        case "control-mode":
          handleControlMode(body);
          break;

        case "control-state":
          handleControlMode(body);
          break;

        default:
          console.warn("Unknown message type:", body.type);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.send(JSON.stringify({ type: "connected" }));

  ws.on('close', () => cleanupConnection(ws));
});

function cleanupConnection(ws: WebSocket) {
  if (admin === ws) {
    console.log("Admin disconnected");
    admin = null;
  } else {
    users = users.filter((user) => user !== ws);
    console.log("active user ", users.length);
  }
}

function handleJoinMode(ws: WebSocket, body: wsConnectionSentType) {
  const payload = body.payload;
  if (payload.userType === "admin") {
    admin = ws;
    console.log("Admin connected");
    ws.send(JSON.stringify({
      "msg": "admin connected"
    }))
  } else {
    users.push(ws);
    console.log("User connected ", users.length);
    ws.send(JSON.stringify({
      "active user ": users.length
    }))
  }
}

function handleControlMode(body: wsDataSentType) {
  const time = Date.now();
  const payload = body.payload;
  users.forEach((user) => {
    if (user.readyState === WebSocket.OPEN) {
      user.send(JSON.stringify({ type: "control-mode", payload, serverTime: time }));
    }
  });
}