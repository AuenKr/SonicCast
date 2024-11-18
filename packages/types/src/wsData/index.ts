export interface wsDataMode {
  type: "join-mode" | "control-mode" | "control-state",
  payload: any
}

interface payloadType {
  musicId: number;
  createdAt: number;
  startAt: number;
  currSeekPos: number;
  status: "play" | "pause";
  speed: number;
  volume: number;
}

export interface wsDataSentType extends wsDataMode {
  payload: payloadType
}

export interface wsDataReceiveType extends wsDataSentType {
  serverTime: Date
}

export interface wsConnectionSentType extends wsDataMode {
  payload: {
    userType: "user" | "admin"
  }
}