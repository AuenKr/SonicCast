import { songDetailAtom, songRunningStatusAtom } from "@/state/atom/songAtom";
import { activeUserAtom } from "@/state/atom/userAtom"
import { wsServerControlModeType, wsServerErrorModeType, wsServerJoinModeType, wsServerStateModeType, wsServerUpdateModeType } from "@repo/types";
import { useSetAtom } from "jotai"
import { useCallback, useRef } from "react"

export function useUserWebSocketHandler() {
  const setActiveUser = useSetAtom(activeUserAtom);
  const setActiveMusic = useSetAtom(songDetailAtom);
  const setMusicRunningStatus = useSetAtom(songRunningStatusAtom);
  const clientTimeDelayRef = useRef<number>(0);

  const handleJoinMode = useCallback((body: wsServerJoinModeType) => {
    setActiveUser(body.activeUser);
    clientTimeDelayRef.current = body.payload.delay;
  }, [setActiveUser])

  const handleControlMode = useCallback((body: wsServerControlModeType) => {
    const payload = body.payload;
    const clientTimeDelay = clientTimeDelayRef.current;

    const delay = (new Date(body.serverSendTime).getTime() - new Date().getTime() - clientTimeDelay) / 1000;
    const runningStatus = payload.runningStatus;

    runningStatus.currentTime = runningStatus.currentTime + delay >= 0 ? Math.round(runningStatus.currentTime + delay) : 0;

    setActiveUser(body.activeUser);
    setMusicRunningStatus(runningStatus);
  }, [setActiveUser, setMusicRunningStatus])

  const handleControlState = useCallback((body: wsServerStateModeType) => {
    const payload = body.payload;
    setActiveUser(body.activeUser);
    setActiveMusic(payload.musicDetail);
    setMusicRunningStatus(payload.runningStatus);
  }, [setActiveMusic, setActiveUser, setMusicRunningStatus])

  const handleUpdateMode = useCallback((body: wsServerUpdateModeType) => {
    const payload = body.payload;
    setActiveUser(body.activeUser);
    setMusicRunningStatus(payload.runningStatus);
  }, [setActiveUser, setMusicRunningStatus])

  const handleServerError = useCallback((body: wsServerErrorModeType) => {
    const payload = body.payload;
    return payload.error;
  }, [])

  return { handleJoinMode, handleControlMode, handleControlState, handleUpdateMode, handleServerError }
}