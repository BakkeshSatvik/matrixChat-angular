import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room } from 'matrix-js-sdk';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (room) {
      <div class="bg-white border-b border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h2 class="text-xl font-semibold">{{ room.name }}</h2>
            <div class="flex items-center space-x-4 mt-1">
              <p class="text-sm text-gray-600">
                {{ room.getJoinedMemberCount() }} members
              </p>
              @if (isEncrypted) {
                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  🔒 Encrypted
                </span>
              }
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-2">
            <button
              (click)="onVoiceCall.emit()"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Start voice call"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </button>
            
            <button
              (click)="onVideoCall.emit()"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Start video call"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>

            <button
              (click)="onRoomInfo.emit()"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Room details"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class ChatHeaderComponent {
  @Input() room: Room | null = null;
  @Input() isEncrypted: boolean = false;
  
  @Output() onVoiceCall = new EventEmitter<void>();
  @Output() onVideoCall = new EventEmitter<void>();
  @Output() onRoomInfo = new EventEmitter<void>();
}
