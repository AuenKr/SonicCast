interface wsDataMode {
  type: any;
}

export interface wsClientModeType extends wsDataMode {
  type: "join-mode" | "control-mode" | "control-state" | "update-mode";
  roomId: string;
  createTime: Date;
  payload: any;
}

export interface wsClientStateModeType extends wsClientModeType {
  type: "control-state";
  payload: {
    musicDetail: SongDetailType,
    runningStatus: SongRunningStatusType
  }
}

export interface wsClientUpdateModeType extends wsClientModeType {
  type: "update-mode";
  payload: {
    runningStatus: SongRunningStatusType
  }
}

export interface wsClientControlModeType extends wsClientModeType {
  type: "control-mode";
  payload: {
    runningStatus: SongRunningStatusType
  }
}

export interface wsServerModeType extends wsDataMode {
  type: "join-mode" | "control-mode" | "control-state" | "server-error" | "update-mode";
  serverSendTime: Date;
  payload: any;
}

export interface wsServerErrorModeType extends wsServerModeType {
  type: "server-error";
  payload: {
    error: string
  }
}

export interface wsServerJoinModeType extends wsServerModeType {
  type: "join-mode";
  activeUser: number;
  payload: {
    msg: string;
    delay: number;
  }
}

export interface wsServerStateModeType extends wsServerModeType {
  type: "control-state";
  activeUser: number;
  payload: {
    musicDetail: SongDetailType,
    runningStatus: SongRunningStatusType
  }
}

export interface wsServerUpdateModeType extends wsServerModeType {
  type: "update-mode";
  activeUser: number;
  payload: {
    runningStatus: SongRunningStatusType
  }
}

export interface wsServerControlModeType extends wsServerModeType {
  type: "control-mode",
  activeUser: number;
  payload: {
    runningStatus: SongRunningStatusType
  }
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

export type UserType = "user" | "admin";

export interface wsInitialDataSentType extends wsClientModeType {
  payload: {
    userType: UserType;
  }
}

export interface SongDetailType {
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

export interface songSuggestionResponseType {
  id: string;
  title: string;
  subtitle: string;
  type: "song" | "artist" | "album";
  image: string;
  perma_url: string;
  more_info: {
    artistMap: never[];
    album: string;
  };
  explicit_content: string;
  mini_obj: boolean;
}

export interface SongRunningStatusType {
  currentTime: number;
  speed: number;
  volume?: number;
  status: "play" | "pause";
}