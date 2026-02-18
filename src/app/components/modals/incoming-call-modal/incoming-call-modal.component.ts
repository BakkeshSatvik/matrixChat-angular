import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incoming-call-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Incoming Call</h2>
            <p class="text-lg text-gray-700">{{ roomName }}</p>
            @if (isVideoCall) {
              <p class="text-sm text-gray-500 mt-1">Video call</p>
            } @else {
              <p class="text-sm text-gray-500 mt-1">Voice call</p>
            }
          </div>

          <!-- Actions -->
          <div class="flex space-x-3">
            <button
              (click)="onReject.emit()"
              class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Decline
            </button>
            <button
              (click)="onAccept.emit()"
              class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class IncomingCallModalComponent {
  @Input() isOpen: boolean = false;
  @Input() roomName: string = '';
  @Input() isVideoCall: boolean = false;
  
  @Output() onAccept = new EventEmitter<void>();
  @Output() onReject = new EventEmitter<void>();
}
