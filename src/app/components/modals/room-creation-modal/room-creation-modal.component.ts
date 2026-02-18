import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-creation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Create New Room</h2>
            <button
              (click)="onClose.emit()"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form (submit)="handleSubmit($event)">
            <div class="space-y-4">
              <!-- Room Name -->
              <div>
                <label for="room-name" class="block text-sm font-medium text-gray-700 mb-1">
                  Room Name
                </label>
                <input
                  id="room-name"
                  type="text"
                  [(ngModel)]="roomName"
                  [ngModelOptions]="{standalone: true}"
                  placeholder="Enter room name"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <!-- Room Topic -->
              <div>
                <label for="room-topic" class="block text-sm font-medium text-gray-700 mb-1">
                  Room Topic (optional)
                </label>
                <textarea
                  id="room-topic"
                  [(ngModel)]="roomTopic"
                  [ngModelOptions]="{standalone: true}"
                  placeholder="What's this room about?"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              <!-- Room Options -->
              <div class="space-y-3">
                <div class="flex items-center">
                  <input
                    id="is-direct"
                    type="checkbox"
                    [(ngModel)]="isDirect"
                    [ngModelOptions]="{standalone: true}"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="is-direct" class="ml-2 text-sm text-gray-700">
                    Direct Message (1-on-1 conversation)
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                    id="is-encrypted"
                    type="checkbox"
                    [(ngModel)]="isEncrypted"
                    [ngModelOptions]="{standalone: true}"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="is-encrypted" class="ml-2 text-sm text-gray-700">
                    Enable end-to-end encryption 🔒
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                    id="is-public"
                    type="checkbox"
                    [(ngModel)]="isPublic"
                    [ngModelOptions]="{standalone: true}"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="is-public" class="ml-2 text-sm text-gray-700">
                    Make room discoverable
                  </label>
                </div>
              </div>

              @if (error()) {
                <div class="rounded-md bg-red-50 p-4">
                  <div class="flex">
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">
                        {{ error() }}
                      </h3>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Actions -->
            <div class="flex space-x-3 mt-6">
              <button
                type="button"
                (click)="onClose.emit()"
                class="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="isLoading()"
                class="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ isLoading() ? 'Creating...' : 'Create Room' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: []
})
export class RoomCreationModalComponent {
  @Input() isOpen: boolean = false;
  
  @Output() onCreate = new EventEmitter<{
    name: string;
    topic: string;
    isDirect: boolean;
    isEncrypted: boolean;
    isPublic: boolean;
  }>();
  @Output() onClose = new EventEmitter<void>();

  roomName = '';
  roomTopic = '';
  isDirect = false;
  isEncrypted = true;
  isPublic = false;
  isLoading = signal(false);
  error = signal<string | null>(null);

  handleSubmit(event: Event): void {
    event.preventDefault();
    
    if (!this.roomName.trim()) {
      this.error.set('Room name is required');
      return;
    }

    this.error.set(null);
    this.onCreate.emit({
      name: this.roomName,
      topic: this.roomTopic,
      isDirect: this.isDirect,
      isEncrypted: this.isEncrypted,
      isPublic: this.isPublic,
    });

    // Reset form
    this.roomName = '';
    this.roomTopic = '';
    this.isDirect = false;
    this.isEncrypted = true;
    this.isPublic = false;
  }
}
