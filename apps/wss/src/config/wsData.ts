export interface wsDataType {
  type: "join-mode" | "control-mode" | "control-state",
  payload: any;
}
export interface joinRoomPayloadType {
  userType: "user" | "admin";
}

export interface musicControlPayloadType {
  musicId: number;
  createdAt: number;
  startAt: number;
  currSeekPos: number;
  status: "play" | "pause";
  speed: number;
  volume: number;
}