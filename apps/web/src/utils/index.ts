export function generateRoomId(n: number = 9) {
  const characters = "abcdefghijkmnopqrstuvwxyz" // l not include for readability
  let roomId = ""
  for (let i = 0; i < n;) {
    for (let j = 0; j < 3; j++) {
      const idx = Math.floor(Math.random() * characters.length);
      roomId += characters[idx];
      i++;
    }
    roomId.length < n - 1 ? roomId += "-" : "";
  }
  return roomId;
}

export function isValidRoomId(roomId: string) {
  if (roomId.length != 11 || roomId.split('-').length != 3)
    return false;
  return true;
}