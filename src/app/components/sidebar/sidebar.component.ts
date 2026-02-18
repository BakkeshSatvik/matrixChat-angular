import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room } from 'matrix-js-sdk';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-bold">Matrix Chat</h1>
        <p class="text-sm text-gray-600">{{ userId }}</p>
      </div>

      <!-- Connection Status -->
      <div class="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div 
            class="w-2 h-2 rounded-full"
            [class.bg-green-500]="syncState === 'PREPARED' || syncState === 'SYNCING'"
            [class.bg-yellow-500]="syncState === 'RECONNECTING'"
            [class.bg-red-500]="syncState === 'ERROR'"
            [class.bg-gray-400]="syncState === 'STOPPED'"
          ></div>
          <span class="text-xs text-gray-600">
            {{ getSyncStateText(syncState) }}
          </span>
        </div>
      </div>

      <!-- Room List -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-sm font-semibold text-gray-600">Rooms</h2>
            <button 
              (click)="onCreateRoom.emit()"
              class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              title="Create new room"
            >
              + New
            </button>
          </div>
          
          @if (rooms.length === 0) {
            <p class="text-sm text-gray-500">No rooms yet</p>
          }
          
          @for (room of rooms; track room.roomId) {
            <div 
              class="p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              [class.bg-blue-50]="selectedRoomId === room.roomId"
              (click)="onRoomSelect.emit(room.roomId)"
            >
              <div class="flex items-start space-x-3">
                <!-- Avatar -->
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {{ getRoomInitials(room) }}
                  </div>
                </div>
                
                <!-- Room Info -->
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">{{ room.name }}</div>
                  <div class="text-sm text-gray-500 truncate">
                    {{ getLastMessage(room) }}
                  </div>
                </div>

                <!-- Unread Badge -->
                @if (getUnreadCount(room) > 0) {
                  <div class="flex-shrink-0">
                    <div class="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {{ getUnreadCount(room) }}
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- User Actions -->
      <div class="p-4 border-t border-gray-200 space-y-2">
        <button
          (click)="onSettings.emit()"
          class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Settings
        </button>
        <button
          (click)="onLogout.emit()"
          class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class SidebarComponent {
  @Input() rooms: Room[] = [];
  @Input() selectedRoomId: string | null = null;
  @Input() userId: string = '';
  @Input() syncState: string = 'STOPPED';
  
  @Output() onRoomSelect = new EventEmitter<string>();
  @Output() onCreateRoom = new EventEmitter<void>();
  @Output() onLogout = new EventEmitter<void>();
  @Output() onSettings = new EventEmitter<void>();

  getRoomInitials(room: Room): string {
    const name = room.name || 'Unknown';
    return name.substring(0, 2).toUpperCase();
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

  getUnreadCount(room: Room): number {
    // Simplified - in production, you'd track this properly
    return room.getUnreadNotificationCount() || 0;
  }

  getSyncStateText(state: string): string {
    switch (state) {
      case 'PREPARED':
      case 'SYNCING':
        return 'Connected';
      case 'RECONNECTING':
        return 'Reconnecting...';
      case 'ERROR':
        return 'Connection Error';
      case 'STOPPED':
        return 'Disconnected';
      default:
        return state;
    }
  }
}
