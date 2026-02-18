import { Injectable } from '@angular/core';
import { SessionData } from '../models/room-state.model';

const SESSION_STORAGE_KEY = 'matrix_session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  saveSession(session: SessionData): void {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  loadSession(): SessionData | null {
    try {
      const data = localStorage.getItem(SESSION_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load session:', error);
      return null;
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  hasSession(): boolean {
    return this.loadSession() !== null;
  }
}
