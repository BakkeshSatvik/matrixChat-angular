import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private permissionGranted = false;

  constructor() {
    this.checkPermission();
  }

  private checkPermission(): void {
    if ('Notification' in window) {
      this.permissionGranted = Notification.permission === 'granted';
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    }

    return false;
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if (!this.permissionGranted) {
      return;
    }

    try {
      new Notification(title, {
        icon: '/assets/icon.png',
        ...options
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  notifyNewMessage(roomName: string, sender: string, message: string): void {
    this.showNotification(`${sender} in ${roomName}`, {
      body: message,
      tag: 'new-message',
    });
  }
}
