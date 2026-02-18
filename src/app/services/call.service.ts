import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatrixCall, CallEvent } from 'matrix-js-sdk';
import { CallState, IncomingCallData } from '../models/call-state.model';
import { MatrixClientService } from './matrix-client.service';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  private callStateSubject = new BehaviorSubject<CallState>({
    call: null,
    isIncoming: false,
    isActive: false,
    isMuted: false,
    isVideoMuted: false,
    remoteStream: null,
    localStream: null,
  });

  public callState$ = this.callStateSubject.asObservable();

  private incomingCallSubject = new BehaviorSubject<IncomingCallData | null>(null);
  public incomingCall$ = this.incomingCallSubject.asObservable();

  constructor(private matrixClientService: MatrixClientService) {
    this.setupCallListeners();
  }

  private setupCallListeners(): void {
    this.matrixClientService.client$.subscribe(client => {
      if (client) {
        client.on('Call.incoming' as any, (call: MatrixCall) => {
          this.handleIncomingCall(call);
        });
      }
    });
  }

  private handleIncomingCall(call: MatrixCall): void {
    const room = this.matrixClientService.getRoom(call.roomId);
    const roomName = room?.name || 'Unknown Room';

    this.incomingCallSubject.next({
      call,
      roomId: call.roomId,
      roomName,
    });

    this.updateCallState({ call, isIncoming: true });
  }

  async startCall(roomId: string, video: boolean): Promise<void> {
    const client = this.matrixClientService.client;
    if (!client) {
      throw new Error('Client not initialized');
    }

    try {
      const call = client.createCall(roomId);
      
      this.updateCallState({ call, isActive: true, isIncoming: false });
      
      await call.placeCall(video, video);
      
      this.setupCallEventListeners(call);
    } catch (error) {
      console.error('Failed to start call:', error);
      throw error;
    }
  }

  async answerCall(): Promise<void> {
    const incomingCall = this.incomingCallSubject.value;
    if (!incomingCall) {
      throw new Error('No incoming call');
    }

    try {
      const call = incomingCall.call;
      await call.answer(true, true);
      
      this.updateCallState({ call, isActive: true, isIncoming: false });
      this.incomingCallSubject.next(null);
      
      this.setupCallEventListeners(call);
    } catch (error) {
      console.error('Failed to answer call:', error);
      throw error;
    }
  }

  rejectCall(): void {
    const incomingCall = this.incomingCallSubject.value;
    if (incomingCall) {
      incomingCall.call.reject();
      this.incomingCallSubject.next(null);
    }
  }

  endCall(): void {
    const currentState = this.callStateSubject.value;
    if (currentState.call) {
      currentState.call.hangup('user_hangup' as any, false);
      this.resetCallState();
    }
  }

  toggleMute(): void {
    const currentState = this.callStateSubject.value;
    if (currentState.call) {
      const newMuteState = !currentState.isMuted;
      currentState.call.setMicrophoneMuted(newMuteState);
      this.updateCallState({ isMuted: newMuteState });
    }
  }

  toggleVideo(): void {
    const currentState = this.callStateSubject.value;
    if (currentState.call) {
      const newVideoMuteState = !currentState.isVideoMuted;
      currentState.call.setLocalVideoMuted(newVideoMuteState);
      this.updateCallState({ isVideoMuted: newVideoMuteState });
    }
  }

  private setupCallEventListeners(call: MatrixCall): void {
    call.on(CallEvent.FeedsChanged, () => {
      const feeds = call.getFeeds();
      const remoteFeed = feeds.find(feed => !feed.isLocal());
      const localFeed = feeds.find(feed => feed.isLocal());

      this.updateCallState({
        remoteStream: remoteFeed?.stream || null,
        localStream: localFeed?.stream || null,
      });
    });

    call.on(CallEvent.Hangup, () => {
      this.resetCallState();
    });
  }

  private updateCallState(updates: Partial<CallState>): void {
    const currentState = this.callStateSubject.value;
    this.callStateSubject.next({ ...currentState, ...updates });
  }

  private resetCallState(): void {
    this.callStateSubject.next({
      call: null,
      isIncoming: false,
      isActive: false,
      isMuted: false,
      isVideoMuted: false,
      remoteStream: null,
      localStream: null,
    });
  }
}
