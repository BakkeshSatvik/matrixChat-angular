import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CallService } from '../../../services/call.service';
import { CallState } from '../../../models/call-state.model';

@Component({
  selector: 'app-call-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (callState && callState.isActive) {
      <div class="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50">
        <div class="max-w-4xl w-full mx-4">
          <!-- Video Streams -->
          <div class="relative">
            <!-- Remote Video -->
            @if (callState.remoteStream) {
              <video
                #remoteVideo
                autoplay
                playsinline
                class="w-full h-auto rounded-lg bg-gray-800"
              ></video>
            } @else {
              <div class="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                <div class="text-center text-white">
                  <div class="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <p class="text-lg">Connecting...</p>
                </div>
              </div>
            }

            <!-- Local Video (Picture-in-Picture) -->
            @if (callState.localStream) {
              <div class="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <video
                  #localVideo
                  autoplay
                  playsinline
                  muted
                  class="w-full h-full object-cover"
                ></video>
              </div>
            }
          </div>

          <!-- Call Controls -->
          <div class="mt-6 flex justify-center space-x-4">
            <!-- Mute Button -->
            <button
              (click)="toggleMute()"
              [class.bg-red-600]="callState.isMuted"
              [class.bg-gray-700]="!callState.isMuted"
              class="p-4 rounded-full hover:opacity-80 transition-all"
              title="{{ callState.isMuted ? 'Unmute' : 'Mute' }}"
            >
              @if (callState.isMuted) {
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                </svg>
              } @else {
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                </svg>
              }
            </button>

            <!-- Video Toggle Button -->
            <button
              (click)="toggleVideo()"
              [class.bg-red-600]="callState.isVideoMuted"
              [class.bg-gray-700]="!callState.isVideoMuted"
              class="p-4 rounded-full hover:opacity-80 transition-all"
              title="{{ callState.isVideoMuted ? 'Start Video' : 'Stop Video' }}"
            >
              @if (callState.isVideoMuted) {
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18"/>
                </svg>
              } @else {
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              }
            </button>

            <!-- End Call Button -->
            <button
              (click)="endCall()"
              class="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
              title="End Call"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"/>
              </svg>
            </button>
          </div>

          <!-- Call Info -->
          <div class="mt-6 text-center text-white">
            <p class="text-lg">
              @if (callState.isIncoming) {
                <span>Incoming call...</span>
              } @else {
                <span>In call</span>
              }
            </p>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class CallPanelComponent implements OnInit, OnDestroy {
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;

  private destroy$ = new Subject<void>();
  callState: CallState | null = null;

  constructor(private callService: CallService) {}

  ngOnInit(): void {
    this.callService.callState$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      this.callState = state;
      
      // Update video elements when streams change
      setTimeout(() => {
        if (state.remoteStream && this.remoteVideo) {
          this.remoteVideo.nativeElement.srcObject = state.remoteStream;
        }
        if (state.localStream && this.localVideo) {
          this.localVideo.nativeElement.srcObject = state.localStream;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMute(): void {
    this.callService.toggleMute();
  }

  toggleVideo(): void {
    this.callService.toggleVideo();
  }

  endCall(): void {
    this.callService.endCall();
  }
}
