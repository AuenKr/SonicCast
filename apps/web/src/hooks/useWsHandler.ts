import { songDetailAtom, songRunningStatusAtom } from "@/state/atom/songAtom";
import { activeUserAtom } from "@/state/atom/userAtom"
import { wsServerControlModeType, wsServerErrorModeType, wsServerJoinModeType, wsServerStateModeType, wsServerUpdateModeType } from "@repo/types";
import { useSetAtom } from "jotai"
import { useCallback } from "react"

export function useUserWebSocketHandler() {
  const setActiveUser = useSetAtom(activeUserAtom);
  const setActiveMusic = useSetAtom(songDetailAtom);
  const setMusicRunningStatus = useSetAtom(songRunningStatusAtom);

  const handleJoinMode = useCallback((body: wsServerJoinModeType) => {
    setActiveUser(body.activeUser);
  }, [])

  const handleControlMode = useCallback((body: wsServerControlModeType) => {
    const payload = body.payload;
    setActiveUser(body.activeUser);
    setMusicRunningStatus(payload.runningStatus);
  }, [])

  const handleControlState = useCallback((body: wsServerStateModeType) => {
    const payload = body.payload;
    setActiveUser(body.activeUser);
    setActiveMusic(payload.musicDetail);
    setMusicRunningStatus(payload.runningStatus);
  }, [])

  const handleUpdateMode = useCallback((body: wsServerUpdateModeType) => {
    const payload = body.payload;
    setActiveUser(body.activeUser);
    setMusicRunningStatus(payload.runningStatus);
  }, [])

  const handleServerError = useCallback((body: wsServerErrorModeType) => {
    const payload = body.payload;
    return payload.error;
  }, [])

  return { handleJoinMode, handleControlMode, handleControlState, handleUpdateMode, handleServerError }
}