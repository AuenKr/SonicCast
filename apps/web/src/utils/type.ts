export interface wsDataType {
  type: "join-mode" | "control-mode" | "control-state",
  payload: {
    musicId: number;
    createdAt: number;
    startAt: number;
    currSeekPos: number;
    status: "play" | "pause";
    speed: number;
    volume: number;
  };
  serverTime?: number;
}
