import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { createClient, MatrixClient, Room, MatrixEvent, RoomMember } from 'matrix-js-sdk';
import { SessionData } from '../models/room-state.model';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class MatrixClientService {
  private clientSubject = new BehaviorSubject<MatrixClient | null>(null);
  public client$ = this.clientSubject.asObservable();
  
  private roomsSubject = new BehaviorSubject<Room[]>([]);
  public rooms$ = this.roomsSubject.asObservable();
  
  private syncStateSubject = new BehaviorSubject<string>('STOPPED');
  public syncState$ = this.syncStateSubject.asObservable();

  constructor(private sessionService: SessionService) {}

  get client(): MatrixClient | null {
    return this.clientSubject.value;
  }

  async login(homeserver: string, username: string, password: string): Promise<void> {
    try {
      const client = createClient({ baseUrl: homeserver });
      const response = await client.login('m.login.password', {
        user: username,
        password: password,
      });

      const sessionData: SessionData = {
        accessToken: response.access_token || '',
        userId: response.user_id || '',
        deviceId: response.device_id || '',
        homeserverUrl: homeserver,
      };

      this.sessionService.saveSession(sessionData);
      await this.initializeClient(sessionData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(homeserver: string, username: string, password: string): Promise<void> {
    try {
      const client = createClient({ baseUrl: homeserver });
      const response = await client.register(username, password, null, {
        type: 'm.login.dummy',
      });

      const sessionData: SessionData = {
        accessToken: response.access_token || '',
        userId: response.user_id || '',
        deviceId: response.device_id || '',
        homeserverUrl: homeserver,
      };

      this.sessionService.saveSession(sessionData);
      await this.initializeClient(sessionData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async restoreSession(): Promise<boolean> {
    const session = this.sessionService.loadSession();
    if (!session) {
      return false;
    }

    try {
      await this.initializeClient(session);
      return true;
    } catch (error) {
      console.error('Failed to restore session:', error);
      this.sessionService.clearSession();
      return false;
    }
  }

  private async initializeClient(session: SessionData): Promise<void> {
    const client = createClient({
      baseUrl: session.homeserverUrl,
      accessToken: session.accessToken,
      userId: session.userId,
      deviceId: session.deviceId,
    });

    this.clientSubject.next(client);
    this.setupEventListeners(client);
    await this.startClient(client);
  }

  private setupEventListeners(client: MatrixClient): void {
    client.on('sync' as any, (state: string) => {
      this.syncStateSubject.next(state);
      if (state === 'PREPARED') {
        this.updateRooms(client);
      }
    });

    client.on('Room.timeline' as any, () => {
      this.updateRooms(client);
    });

    client.on('Room' as any, () => {
      this.updateRooms(client);
    });
  }

  private async startClient(client: MatrixClient): Promise<void> {
    await client.startClient({ initialSyncLimit: 20 });
  }

  private updateRooms(client: MatrixClient): void {
    const rooms = client.getRooms();
    this.roomsSubject.next(rooms);
  }

  async createRoom(name: string, isDirect: boolean = false, encrypted: boolean = false): Promise<string> {
    const client = this.client;
    if (!client) {
      throw new Error('Client not initialized');
    }

    const options: any = {
      name,
      visibility: 'private' as any,
      is_direct: isDirect,
    };

    if (encrypted) {
      options.initial_state = [
        {
          type: 'm.room.encryption',
          state_key: '',
          content: {
            algorithm: 'm.megolm.v1.aes-sha2',
          },
        },
      ];
    }

    const response = await client.createRoom(options);
    return response.room_id;
  }

  async sendMessage(roomId: string, content: string): Promise<void> {
    const client = this.client;
    if (!client) {
      throw new Error('Client not initialized');
    }

    await client.sendTextMessage(roomId, content);
  }

  async logout(): Promise<void> {
    const client = this.client;
    if (client) {
      await client.logout();
      client.stopClient();
    }
    this.sessionService.clearSession();
    this.clientSubject.next(null);
    this.roomsSubject.next([]);
    this.syncStateSubject.next('STOPPED');
  }

  getRoom(roomId: string): Room | null {
    const client = this.client;
    return client ? client.getRoom(roomId) : null;
  }
}
