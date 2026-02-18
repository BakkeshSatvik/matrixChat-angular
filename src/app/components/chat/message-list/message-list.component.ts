import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DisplayMessage {
  event_id: string;
  sender: string;
  senderName: string;
  content: any;
  timestamp: number;
  isOwn: boolean;
}

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #messageContainer class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      @if (messages.length === 0) {
        <div class="text-center text-gray-500 mt-8">
          <div class="text-4xl mb-4">💬</div>
          <p>No messages yet. Start the conversation!</p>
        </div>
      }
      
      @for (message of messages; track message.event_id) {
        <div 
          class="flex items-start space-x-3"
          [class.flex-row-reverse]="message.isOwn"
          [class.space-x-reverse]="message.isOwn"
        >
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              [class.bg-blue-500]="!message.isOwn"
              [class.bg-green-500]="message.isOwn"
            >
              {{ getSenderInitials(message.senderName) }}
            </div>
          </div>
          
          <!-- Message Content -->
          <div 
            class="flex-1 max-w-md"
            [class.ml-auto]="message.isOwn"
          >
            <div class="flex items-baseline space-x-2 mb-1">
              <span class="font-semibold text-sm">
                {{ message.isOwn ? 'You' : message.senderName }}
              </span>
              <span class="text-xs text-gray-500">
                {{ formatTimestamp(message.timestamp) }}
              </span>
            </div>
            
            <div 
              class="rounded-lg p-3"
              [class.bg-white]="!message.isOwn"
              [class.bg-blue-600]="message.isOwn"
              [class.text-gray-800]="!message.isOwn"
              [class.text-white]="message.isOwn"
            >
              <!-- Text Message -->
              @if (message.content.msgtype === 'm.text' || !message.content.msgtype) {
                <p class="whitespace-pre-wrap break-words">{{ message.content.body }}</p>
              }
              
              <!-- Image Message -->
              @if (message.content.msgtype === 'm.image') {
                <div>
                  <img 
                    [src]="message.content.url" 
                    [alt]="message.content.body"
                    class="max-w-full rounded"
                  />
                  <p class="mt-2 text-sm">{{ message.content.body }}</p>
                </div>
              }
              
              <!-- File Message -->
              @if (message.content.msgtype === 'm.file') {
                <div class="flex items-center space-x-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                  <span>{{ message.content.body }}</span>
                </div>
              }
            </div>

            <!-- Reactions -->
            @if (hasReactions(message)) {
              <div class="flex flex-wrap gap-1 mt-2">
                @for (reaction of getReactions(message); track reaction.emoji) {
                  <button
                    (click)="onReaction.emit({ messageId: message.event_id, emoji: reaction.emoji })"
                    class="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full flex items-center space-x-1"
                  >
                    <span>{{ reaction.emoji }}</span>
                    <span class="text-xs text-gray-600">{{ reaction.count }}</span>
                  </button>
                }
              </div>
            }
          </div>

          <!-- Message Actions -->
          <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              (click)="showReactionPicker(message.event_id)"
              class="p-1 rounded hover:bg-gray-200"
              title="Add reaction"
            >
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `]
})
export class MessageListComponent implements OnChanges, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  
  @Input() messages: DisplayMessage[] = [];
  @Input() currentUserId: string = '';
  
  @Output() onReaction = new EventEmitter<{ messageId: string; emoji: string }>();
  
  private shouldScrollToBottom = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.shouldScrollToBottom = true;
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        const element = this.messageContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  getSenderInitials(senderName: string): string {
    return senderName.substring(0, 2).toUpperCase();
  }

  formatTimestamp(ts: number): string {
    const date = new Date(ts);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  }

  hasReactions(message: DisplayMessage): boolean {
    // Placeholder - implement reaction tracking
    return false;
  }

  getReactions(message: DisplayMessage): Array<{ emoji: string; count: number }> {
    // Placeholder - implement reaction tracking
    return [];
  }

  showReactionPicker(messageId: string): void {
    // Placeholder - implement reaction picker
    console.log('Show reaction picker for message:', messageId);
  }
}
