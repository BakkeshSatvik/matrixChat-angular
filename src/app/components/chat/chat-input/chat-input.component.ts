import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white border-t border-gray-200 p-4">
      <form (submit)="onSubmit($event)" class="flex items-end space-x-2">
        <!-- Emoji Picker Button -->
        <button
          type="button"
          (click)="toggleEmojiPicker()"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          title="Add emoji"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>

        <!-- Message Input -->
        <div class="flex-1 relative">
          <textarea
            [(ngModel)]="messageText"
            [ngModelOptions]="{standalone: true}"
            (keydown.enter)="onEnterKey($any($event))"
            placeholder="Type a message..."
            rows="1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            style="max-height: 120px;"
          ></textarea>

          <!-- Emoji Picker -->
          @if (showEmojiPicker()) {
            <div class="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
              <div class="grid grid-cols-8 gap-2">
                @for (emoji of commonEmojis; track emoji) {
                  <button
                    type="button"
                    (click)="insertEmoji(emoji)"
                    class="text-2xl hover:bg-gray-100 rounded p-1"
                  >
                    {{ emoji }}
                  </button>
                }
              </div>
            </div>
          }
        </div>

        <!-- File Upload Button -->
        <button
          type="button"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          title="Attach file"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
          </svg>
        </button>

        <!-- Send Button -->
        <button
          type="submit"
          [disabled]="!messageText.trim()"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          Send
        </button>
      </form>

      <!-- Typing Indicator -->
      @if (typingUsers.length > 0) {
        <div class="mt-2 text-sm text-gray-600">
          {{ getTypingText() }}
        </div>
      }
    </div>
  `,
  styles: []
})
export class ChatInputComponent {
  @Output() onSendMessage = new EventEmitter<string>();
  
  messageText = '';
  showEmojiPicker = signal(false);
  typingUsers: string[] = [];

  commonEmojis = [
    '😀', '😂', '😊', '😍', '🥰', '😎', '🤔', '😮',
    '😢', '😡', '👍', '👎', '🙏', '💪', '🎉', '❤️',
    '🔥', '✨', '⭐', '✅', '❌', '🎵', '🎁', '🍕'
  ];

  toggleEmojiPicker(): void {
    this.showEmojiPicker.set(!this.showEmojiPicker());
  }

  insertEmoji(emoji: string): void {
    this.messageText += emoji;
    this.showEmojiPicker.set(false);
  }

  onEnterKey(event: KeyboardEvent): void {
    if (!event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submit();
  }

  private submit(): void {
    const text = this.messageText.trim();
    if (text) {
      this.onSendMessage.emit(text);
      this.messageText = '';
    }
  }

  getTypingText(): string {
    if (this.typingUsers.length === 1) {
      return `${this.typingUsers[0]} is typing...`;
    } else if (this.typingUsers.length === 2) {
      return `${this.typingUsers[0]} and ${this.typingUsers[1]} are typing...`;
    } else {
      return 'Several people are typing...';
    }
  }
}
