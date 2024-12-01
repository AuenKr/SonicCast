import { WebSocket } from "ws";

export class Room {
  public admin: WebSocket;
  public users: Set<WebSocket>;

  constructor(adminWs: WebSocket) {
    this.admin = adminWs;
    this.users = new Set<WebSocket>();
  }

  public addUser(userWs: WebSocket) {
    this.users.add(userWs);
  }

  public removeUser(userWs: WebSocket) {
    if (userWs === this.admin) {
      this.users.forEach((eachUser) => {
        if (eachUser.readyState === WebSocket.OPEN) {
          eachUser.send(
            JSON.stringify({ msg: "Admin left the room, connection will be closed." }),
            () => eachUser.close(1001, "Admin left the room")
          );
        }
      });

      this.users.clear();
      userWs.close(1000, "You left the room");
    } else {
      if (userWs.readyState === WebSocket.OPEN) {
        userWs.send(
          JSON.stringify({ msg: "You have been disconnected." }),
          () => userWs.close(1000, "User disconnected")
        );
      }
      this.users.delete(userWs);
    }
  }


  public deleteRoom() {
    this.removeUser(this.admin);
  }

  public activeUser() {
    return this.users.size;
  }

  public broadcastAllMsg(message: string) {
    this.users.forEach((each) => {
      each.send(message);
    })
    this.admin.send(message);
  }

  public broadcastUserMsg(message: string) {
    this.users.forEach((each) => {
      each.send(message);
    })
  }
}

class RoomManager {
  private static instance: RoomManager;
  private rooms: Map<string, Room>;
  private userRoom: Map<WebSocket, string>;

  private constructor() {
    this.rooms = new Map<string, Room>();
    this.userRoom = new Map<WebSocket, string>();
  }

  static getInstance() {
    if (RoomManager.instance) {
      return RoomManager.instance;
    }

    RoomManager.instance = new RoomManager();
    return RoomManager.instance;
  }

  public getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  public getRoomIdByWs(userWs: WebSocket) {
    return this.userRoom.get(userWs);
  }

  public createRoom(roomId: string, adminWs: WebSocket) {
    const room = new Room(adminWs);
    this.rooms.set(roomId, room);
    this.userRoom.set(adminWs, roomId);
  }

  public addUser(roomId: string, userWs: WebSocket) {
    const room = this.getRoom(roomId);
    if (!room) return;
    this.userRoom.set(userWs, roomId);
    room.addUser(userWs);
  }

  public removeUser(userWs: WebSocket) {
    const roomId = this.userRoom.get(userWs);
    if (!roomId) return;
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.removeUser(userWs);
  }
}

export const roomManger = RoomManager.getInstance();