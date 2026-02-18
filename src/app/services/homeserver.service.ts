import { Injectable } from '@angular/core';

export interface HomeserverInfo {
  baseUrl: string;
  name: string;
  isReachable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HomeserverService {
  private readonly DEFAULT_HOMESERVERS = [
    { name: 'matrix.org', baseUrl: 'https://matrix.org' },
    { name: 'matrix.envs.net', baseUrl: 'https://matrix.envs.net' },
  ];

  async checkHomeserver(url: string): Promise<boolean> {
    try {
      const response = await fetch(`${url}/_matrix/client/versions`);
      return response.ok;
    } catch (error) {
      console.error('Homeserver check failed:', error);
      return false;
    }
  }

  getDefaultHomeservers(): HomeserverInfo[] {
    return this.DEFAULT_HOMESERVERS.map(hs => ({
      ...hs,
      isReachable: true, // Assume reachable by default
    }));
  }

  normalizeHomeserverUrl(url: string): string {
    let normalized = url.trim();
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized;
    }
    return normalized;
  }
}
