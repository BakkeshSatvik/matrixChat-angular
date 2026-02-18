import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quick-start-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-blue-800">Quick Start Guide</h3>
          <div class="mt-2 text-sm text-blue-700">
            <ul class="list-disc list-inside space-y-1">
              <li>Create a new room to start chatting</li>
              <li>Join existing rooms by searching</li>
              <li>Start voice or video calls from the chat header</li>
              <li>Enable encryption for secure messaging</li>
            </ul>
          </div>
          <div class="mt-3">
            <button
              (click)="onDismiss.emit()"
              class="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
        <div class="ml-3 flex-shrink-0">
          <button
            (click)="onDismiss.emit()"
            class="text-blue-400 hover:text-blue-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class QuickStartBannerComponent {
  @Output() onDismiss = new EventEmitter<void>();
}
