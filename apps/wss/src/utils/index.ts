import { wsClientControlModeType, wsClientStateModeType, wsClientUpdateModeType, wsInitialDataSentType, wsServerControlModeType, wsServerErrorModeType, wsServerJoinModeType, wsServerStateModeType, wsServerUpdateModeType } from "@repo/types";
import { roomManger } from "../roomManger";
import { WebSocket } from "ws";

// Initial room join
export function handleJoinMode(ws: WebSocket, body: wsInitialDataSentType) {
  const serverTime = new Date();
  const userType = body.payload.userType;
  const roomId = body.roomId;
  let activeUser: number = 0;

  const clientTime = new Date(body.createTime);
  const delay = serverTime.getTime() - clientTime.getTime();

  if (userType === "admin") {
    roomManger.createRoom(roomId, ws);
  }
  else if (userType === "user") {
    const room = roomManger.getRoom(roomId);
    if (!room) {
      const errorMsg: wsServerErrorModeType = {
        type: "server-error",
        serverSendTime: new Date(),
        payload: {
          error: "Invalid room Id",
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
    serverSendTime: new Date(),
    activeUser: activeUser,
    payload: {
      msg: "user joined room",
      delay
    }
  }

  ws.send(JSON.stringify(serverMsg));
}

// handle the only play logic
export function handleControlMode(ws: WebSocket, body: wsClientControlModeType) {
  const roomId = body.roomId;
  const room = roomManger.getRoom(roomId);

  if (!room) {
    const errorMsg: wsServerErrorModeType = {
      type: "server-error",
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
    serverSendTime: new Date(),
    payload: {
      runningStatus: body.payload.runningStatus
    }
  }

  room.broadcastUserMsg(JSON.stringify(data))
}

// Broadcast to all user song has changed
export function handleControlState(ws: WebSocket, body: wsClientStateModeType) {

  const roomId = body.roomId;
  const room = roomManger.getRoom(roomId);

  if (!room) {
    const errorMsg: wsServerErrorModeType = {
      type: "server-error",
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
    serverSendTime: new Date(),
    payload: {
      musicDetail: body.payload.musicDetail,
      runningStatus: body.payload.runningStatus
    }
  }

  room.broadcastAllMsg(JSON.stringify(data))
}

// Broadcast to all room user, about song status: speed, volume, pause.
export function handleUpdateMode(ws: WebSocket, body: wsClientUpdateModeType) {
  const roomId = body.roomId;
  const room = roomManger.getRoom(roomId);

  if (!room) {
    const errorMsg: wsServerErrorModeType = {
      type: "server-error",
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
    serverSendTime: new Date(),
    payload: {
      runningStatus: body.payload.runningStatus
    }
  }

  room.broadcastAllMsg(JSON.stringify(data))
}