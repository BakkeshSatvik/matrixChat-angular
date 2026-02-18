import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
      <div 
        class="w-2 h-2 rounded-full"
        [class.bg-green-500]="syncState === 'PREPARED' || syncState === 'SYNCING'"
        [class.bg-yellow-500]="syncState === 'RECONNECTING'"
        [class.bg-red-500]="syncState === 'ERROR'"
        [class.bg-gray-400]="syncState === 'STOPPED'"
        [class.animate-pulse]="syncState === 'RECONNECTING' || syncState === 'SYNCING'"
      ></div>
      <span class="text-xs text-gray-600">
        {{ getSyncStateText(syncState) }}
      </span>
    </div>
  `,
  styles: []
})
export class ConnectionStatusComponent {
  @Input() syncState: string = 'STOPPED';

  getSyncStateText(state: string): string {
    switch (state) {
      case 'PREPARED':
        return 'Connected';
      case 'SYNCING':
        return 'Syncing...';
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
