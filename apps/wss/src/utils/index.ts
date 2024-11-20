import { wsClientControlModeType, wsClientStateModeType, wsClientUpdateModeType, wsInitialDataSentType, wsServerControlModeType, wsServerErrorModeType, wsServerJoinModeType, wsServerStateModeType, wsServerUpdateModeType } from "@repo/types";
import { roomManger } from "../roomManger";
import { WebSocket } from "ws";

// Initial room join
export function handleJoinMode(ws: WebSocket, body: wsInitialDataSentType) {
  const serverReceiveTime = new Date();

  const userType = body.payload.userType;
  const roomId = body.roomId;
  let activeUser: number = 0;

  if (userType === "admin") {
    roomManger.createRoom(roomId, ws);
  }
  else if (userType === "user") {
    const room = roomManger.getRoom(roomId);
    if (!room) {
      const errorMsg: wsServerErrorModeType = {
        type: "server-error",
        serverReceiveTime,
        serverSendTime: new Date(),
        payload: {
          error: "Invalid room Id"
        }
      }

      ws.send(JSON.stringify(errorMsg));
      return;
    }

    roomManger.addUser(roomId, ws);
    activeUser = room.activeUser();
  }

  const serverMsg: wsServerJoinModeType = {
    type: "join-mode",
    serverReceiveTime: serverReceiveTime,
    serverSendTime: new Date(),
    activeUser: activeUser,
    payload: {
      msg: "user joined room"
    }
  }

  ws.send(JSON.stringify(serverMsg));
}

// handle the only play logic
export function handleControlMode(ws: WebSocket, body: wsClientControlModeType) {
  const serverReceiveTime = new Date();

  const roomId = body.roomId;
  const room = roomManger.getRoom(roomId);

  if (!room) {
    const errorMsg: wsServerErrorModeType = {
      type: "server-error",
      serverReceiveTime,
      serverSendTime: new Date(),
      payload: {
        error: "Invalid room Id"
      }
    }
    ws.send(JSON.stringify(errorMsg));
    return;
  }

  const data: wsServerControlModeType = {
    type: "control-mode",
    activeUser: room.activeUser(),
    serverReceiveTime,
    serverSendTime: new Date(),
    payload: {
      runningStatus: body.payload.runningStatus
    }
  }

  room.broadcastUserMsg(JSON.stringify(data))
}

// Broadcast to all user song has changed
export function handleControlState(ws: WebSocket, body: wsClientStateModeType) {
  const serverReceiveTime = new Date();

  const roomId = body.roomId;
  const room = roomManger.getRoom(roomId);

  if (!room) {
    const errorMsg: wsServerErrorModeType = {
      type: "server-error",
      serverReceiveTime,
      serverSendTime: new Date(),
      payload: {
        error: "Invalid room Id"
      }
    }
    ws.send(JSON.stringify(errorMsg));
    return;
  }

  const data: wsServerStateModeType = {
    type: "control-state",
    activeUser: room.activeUser(),
    serverReceiveTime,
    serverSendTime: new Date(),
    payload: {
      musicDetail: body.payload.musicDetail,
      runningStatus: body.payload.runningStatus
    }
  }

  room.broadcastUserMsg(JSON.stringify(data))
}

// Broadcast to all room user, about song status: speed, volume, pause.
export function handleUpdateMode(ws: WebSocket, body: wsClientUpdateModeType) {
  const serverReceiveTime = new Date();

  const roomId = body.roomId;
  const room = roomManger.getRoom(roomId);

  if (!room) {
    const errorMsg: wsServerErrorModeType = {
      type: "server-error",
      serverReceiveTime,
      serverSendTime: new Date(),
      payload: {
        error: "Invalid room Id"
      }
    }
    ws.send(JSON.stringify(errorMsg));
    return;
  }

  const data: wsServerUpdateModeType = {
    type: "update-mode",
    activeUser: room.activeUser(),
    serverReceiveTime,
    serverSendTime: new Date(),
    payload: {
      runningStatus: body.payload.runningStatus
    }
  }

  room.broadcastAllMsg(JSON.stringify(data))
}