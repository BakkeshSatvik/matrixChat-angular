import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass">
      <div 
        class="animate-spin rounded-full border-4 border-gray-300"
        [class.border-t-blue-600]="color === 'blue'"
        [class.border-t-white]="color === 'white'"
        [class.border-t-gray-600]="color === 'gray'"
        [style.width.px]="size"
        [style.height.px]="size"
      ></div>
      @if (text) {
        <p class="mt-2 text-sm" [class.text-gray-600]="color !== 'white'" [class.text-white]="color === 'white'">
          {{ text }}
        </p>
      }
    </div>
  `,
  styles: []
})
export class LoadingSpinnerComponent {
  @Input() size: number = 40;
  @Input() color: 'blue' | 'white' | 'gray' = 'blue';
  @Input() text: string = '';
  @Input() containerClass: string = 'flex flex-col items-center justify-center';
}
