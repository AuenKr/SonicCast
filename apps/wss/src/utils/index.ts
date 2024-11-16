export interface RoomType {
  admin: WebSocket | null;
  users: WebSocket[]
}