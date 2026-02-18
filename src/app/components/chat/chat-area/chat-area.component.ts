import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Room } from 'matrix-js-sdk';
import { MatrixClientService } from '../../../services/matrix-client.service';
import { NotificationService } from '../../../services/notification.service';
import { CallService } from '../../../services/call.service';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { MessageListComponent, DisplayMessage } from '../message-list/message-list.component';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    ChatHeaderComponent,
    ChatInputComponent,
    MessageListComponent
  ],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <app-sidebar
        [rooms]="rooms()"
        [selectedRoomId]="selectedRoomId()"
        [userId]="userId()"
        [syncState]="syncState()"
        (onRoomSelect)="selectRoom($event)"
        (onCreateRoom)="createNewRoom()"
        (onLogout)="logout()"
        (onSettings)="openSettings()"
      />

      <!-- Main Chat Area -->
      <div class="flex-1 flex flex-col">
        @if (selectedRoom()) {
          <!-- Chat Header -->
          <app-chat-header
            [room]="selectedRoom()"
            [isEncrypted]="isRoomEncrypted()"
            (onVoiceCall)="startVoiceCall()"
            (onVideoCall)="startVideoCall()"
            (onRoomInfo)="openRoomInfo()"
          />

          <!-- Messages -->
          <app-message-list
            [messages]="displayMessages()"
            [currentUserId]="userId()"
            (onReaction)="handleReaction($event)"
          />

          <!-- Message Input -->
          <app-chat-input
            (onSendMessage)="sendMessage($event)"
          />
        } @else {
          <div class="flex-1 flex items-center justify-center text-gray-500">
            <div class="text-center">
              <div class="text-6xl mb-4">💬</div>
              <h2 class="text-2xl font-semibold mb-2">Welcome to Matrix Chat</h2>
              <p>Select a room to start chatting</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class ChatAreaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  rooms = signal<Room[]>([]);
  selectedRoomId = signal<string | null>(null);
  selectedRoom = signal<Room | null>(null);
  displayMessages = signal<DisplayMessage[]>([]);
  userId = signal<string>('');
  syncState = signal<string>('STOPPED');

  constructor(
    private matrixClientService: MatrixClientService,
    private notificationService: NotificationService,
    private callService: CallService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Request notification permission
    this.notificationService.requestPermission();

    // Subscribe to client
    this.matrixClientService.client$.pipe(takeUntil(this.destroy$)).subscribe(client => {
      if (client) {
        this.userId.set(client.getUserId() || '');
      }
    });

    // Subscribe to rooms
    this.matrixClientService.rooms$.pipe(takeUntil(this.destroy$)).subscribe(rooms => {
      this.rooms.set(rooms);
    });

    // Subscribe to sync state
    this.matrixClientService.syncState$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      console.log('Sync state:', state);
      this.syncState.set(state);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectRoom(roomId: string): void {
    this.selectedRoomId.set(roomId);
    const room = this.matrixClientService.getRoom(roomId);
    this.selectedRoom.set(room);
    
    if (room) {
      this.loadMessages(room);
    }
  }

  loadMessages(room: Room): void {
    const timeline = room.getLiveTimeline();
    const events = timeline.getEvents();
    const currentUserId = this.userId();
    
    const messageEvents: DisplayMessage[] = events
      .filter(event => event.getType() === 'm.room.message')
      .map(event => ({
        event_id: event.getId() || '',
        sender: event.getSender() || '',
        senderName: this.getSenderName(event.getSender() || '', room),
        timestamp: event.getTs(),
        content: event.getContent(),
        isOwn: event.getSender() === currentUserId
      }));
    
    this.displayMessages.set(messageEvents);
  }

  async sendMessage(messageText: string): Promise<void> {
    const roomId = this.selectedRoomId();
    if (!roomId || !messageText.trim()) {
      return;
    }

    try {
      await this.matrixClientService.sendMessage(roomId, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  getSenderName(senderId: string, room: Room | null = null): string {
    const targetRoom = room || this.selectedRoom();
    if (!targetRoom) return senderId;
    
    const member = targetRoom.getMember(senderId);
    return member?.name || senderId;
  }

  isRoomEncrypted(): boolean {
    const room = this.selectedRoom();
    if (!room) return false;
    
    const encryptionEvent = room.currentState.getStateEvents('m.room.encryption', '');
    return !!encryptionEvent;
  }

  async startVoiceCall(): Promise<void> {
    const roomId = this.selectedRoomId();
    if (!roomId) return;

    try {
      await this.callService.startCall(roomId, false);
    } catch (error) {
      console.error('Failed to start voice call:', error);
    }
  }

  async startVideoCall(): Promise<void> {
    const roomId = this.selectedRoomId();
    if (!roomId) return;

    try {
      await this.callService.startCall(roomId, true);
    } catch (error) {
      console.error('Failed to start video call:', error);
    }
  }

  openRoomInfo(): void {
    console.log('Open room info');
    // TODO: Implement room info drawer
  }

  createNewRoom(): void {
    console.log('Create new room');
    // TODO: Implement room creation modal
  }

  openSettings(): void {
    console.log('Open settings');
    // TODO: Implement settings
  }

  handleReaction(event: { messageId: string; emoji: string }): void {
    console.log('Handle reaction:', event);
    // TODO: Implement reactions
  }

  async logout(): Promise<void> {
    try {
      await this.matrixClientService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
