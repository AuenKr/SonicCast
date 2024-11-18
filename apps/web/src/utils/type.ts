interface wsDataMode {
  type: "join-mode" | "control-mode" | "control-state",
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

export interface SearchResultType {
  id: string;
  name: string;
  year: string;
  duration: number;
  playCount: number;
  language: string;
  artists: {
    id: string;
    name: string;
    role: string;
    image: {
      quality: string;
      url: string;
    }[];
    type: string;
    url: string;
  }[];
  image: {
    quality: string;
    url: string;
  }[];
  downloadUrl: {
    quality: string;
    url: string;
  }[];
};