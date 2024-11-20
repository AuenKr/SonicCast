// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wsSendMsg(ws: WebSocket, msg: any) {
  ws.send(JSON.stringify(msg));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wsReceiveMsg(event: MessageEvent<any>) {
  return JSON.parse(event.data)
}