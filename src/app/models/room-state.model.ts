export interface RoomState {
  roomId: string;
  name: string;
  avatarUrl?: string;
  lastMessage?: string;
  unreadCount: number;
  isDM: boolean;
  isEncrypted: boolean;
}

export interface SessionData {
  accessToken: string;
  userId: string;
  deviceId: string;
  homeserverUrl: string;
}
