import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Room } from 'matrix-js-sdk';
import { MatrixClientService } from '../../../services/matrix-client.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div class="p-4 border-b border-gray-200">
          <h1 class="text-xl font-bold">Matrix Chat</h1>
          <p class="text-sm text-gray-600">{{ userId() }}</p>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <div class="p-4">
            <h2 class="text-sm font-semibold text-gray-600 mb-2">Rooms</h2>
            @if (rooms().length === 0) {
              <p class="text-sm text-gray-500">No rooms yet</p>
            }
            @for (room of rooms(); track room.roomId) {
              <div 
                class="p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100"
                [class.bg-blue-50]="selectedRoomId() === room.roomId"
                (click)="selectRoom(room.roomId)"
              >
                <div class="font-medium">{{ room.name }}</div>
                <div class="text-sm text-gray-500 truncate">
                  {{ getLastMessage(room) }}
                </div>
              </div>
            }
          </div>
        </div>

        <div class="p-4 border-t border-gray-200">
          <button
            (click)="logout()"
            class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div class="flex-1 flex flex-col">
        @if (selectedRoom()) {
          <!-- Chat Header -->
          <div class="bg-white border-b border-gray-200 p-4">
            <h2 class="text-xl font-semibold">{{ selectedRoom()?.name }}</h2>
            <p class="text-sm text-gray-600">
              {{ selectedRoom()?.getJoinedMemberCount() }} members
            </p>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            @if (messages().length === 0) {
              <div class="text-center text-gray-500 mt-8">
                No messages yet. Start the conversation!
              </div>
            }
            @for (message of messages(); track message.event_id) {
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {{ getSenderInitials(message.sender) }}
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-baseline space-x-2">
                    <span class="font-semibold">{{ getSenderName(message.sender) }}</span>
                    <span class="text-xs text-gray-500">
                      {{ formatTimestamp(message.origin_server_ts) }}
                    </span>
                  </div>
                  <div class="mt-1 text-gray-800">
                    {{ message.content.body }}
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Message Input -->
          <div class="bg-white border-t border-gray-200 p-4">
            <form (submit)="sendMessage($event)" class="flex space-x-2">
              <input
                type="text"
                [(ngModel)]="messageText"
                [ngModelOptions]="{standalone: true}"
                placeholder="Type a message..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                [disabled]="!messageText.trim()"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        } @else {
          <div class="flex-1 flex items-center justify-center text-gray-500">
            Select a room to start chatting
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
  messages = signal<any[]>([]);
  userId = signal<string>('');
  messageText = '';

  constructor(
    private matrixClientService: MatrixClientService,
    private notificationService: NotificationService,
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
    
    const messageEvents = events
      .filter(event => event.getType() === 'm.room.message')
      .map(event => ({
        event_id: event.getId(),
        sender: event.getSender() || '',
        origin_server_ts: event.getTs(),
        content: event.getContent(),
      }));
    
    this.messages.set(messageEvents);
  }

  async sendMessage(event: Event): Promise<void> {
    event.preventDefault();
    
    const roomId = this.selectedRoomId();
    if (!roomId || !this.messageText.trim()) {
      return;
    }

    try {
      await this.matrixClientService.sendMessage(roomId, this.messageText);
      this.messageText = '';
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  getLastMessage(room: Room): string {
    const timeline = room.getLiveTimeline();
    const events = timeline.getEvents();
    const lastMessage = events
      .filter(e => e.getType() === 'm.room.message')
      .pop();
    
    const content = lastMessage?.getContent();
    return content?.['body'] || 'No messages';
  }

  getSenderName(senderId: string): string {
    const room = this.selectedRoom();
    if (!room) return senderId;
    
    const member = room.getMember(senderId);
    return member?.name || senderId;
  }

  getSenderInitials(senderId: string): string {
    const name = this.getSenderName(senderId);
    return name.substring(0, 2).toUpperCase();
  }

  formatTimestamp(ts: number): string {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
