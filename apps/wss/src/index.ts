import { WebSocket, WebSocketServer } from 'ws';
import { wsClientControlModeType, wsClientModeType, wsClientStateModeType, wsClientUpdateModeType, wsInitialDataSentType } from '@repo/types'
import { handleControlMode, handleControlState, handleJoinMode, handleUpdateMode } from './utils';
import { error } from 'console';
import { roomManger } from './roomManger';

const PORT = parseInt(process.env.PORT || "8080");
const wss = new WebSocketServer({ port: PORT });

console.log("Start server on port ", PORT);
wss.on('connection', function connection(ws: WebSocket) {

  ws.send(JSON.stringify({ msg: "connection established" }));

  ws.on('error', () => {
    console.log("error", error);
    ws.close();
  });

  ws.on('close', () => {
    const roomId = roomManger.getRoomIdByWs(ws);
    roomManger.removeUser(ws);
    console.log("user left room ", roomId);
  });

  ws.on('message', function message(data) {
    try {
      const body: wsClientModeType = JSON.parse(data.toString());
      switch (body.type) {
        case "join-mode": // Initial room join
          handleJoinMode(ws, body as unknown as wsInitialDataSentType)
          console.log("join-mode");
          break;

        case "control-mode": // handle the only play, speed logic
          handleControlMode(ws, body as unknown as wsClientControlModeType)
          console.log("control-mode");
          break;

        case "control-state": // Broadcast to all user song has changed
          handleControlState(ws, body as unknown as wsClientStateModeType)
          console.log("control-state");
          break;

        case "update-mode": // Broadcast to all room user, about song status: volume, pause.
          handleUpdateMode(ws, body as unknown as wsClientUpdateModeType);
          console.log("update-mode");
          break;

        default:
          console.warn("Unknown message type:", body.type);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });
});