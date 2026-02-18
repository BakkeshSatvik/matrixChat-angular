import { MatrixCall } from 'matrix-js-sdk';

export interface CallState {
  call: MatrixCall | null;
  isIncoming: boolean;
  isActive: boolean;
  isMuted: boolean;
  isVideoMuted: boolean;
  remoteStream: MediaStream | null;
  localStream: MediaStream | null;
}

export interface IncomingCallData {
  call: MatrixCall;
  roomId: string;
  roomName: string;
}
