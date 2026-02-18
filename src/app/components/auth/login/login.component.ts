import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatrixClientService } from '../../../services/matrix-client.service';
import { HomeserverService } from '../../../services/homeserver.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Matrix Chat
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <a routerLink="/register" class="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </a>
          </p>
        </div>
        
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
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
          
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="homeserver" class="sr-only">Homeserver</label>
              <input
                id="homeserver"
                name="homeserver"
                type="text"
                required
                [(ngModel)]="homeserver"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Homeserver URL (e.g., https://matrix.org)"
              />
            </div>
            <div>
              <label for="username" class="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                [(ngModel)]="username"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                [(ngModel)]="password"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="isLoading()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isLoading()) {
                <app-loading-spinner [size]="20" color="white" containerClass="flex items-center" />
              } @else {
                <span>Sign in</span>
              }
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">
                Quick start with matrix.org
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  homeserver = 'https://matrix.org';
  username = '';
  password = '';
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private matrixClientService: MatrixClientService,
    private homeserverService: HomeserverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Try to restore session
    this.matrixClientService.restoreSession().then(restored => {
      if (restored) {
        this.router.navigate(['/chat']);
      }
    });
  }

  async onSubmit(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const normalizedHomeserver = this.homeserverService.normalizeHomeserverUrl(this.homeserver);
      await this.matrixClientService.login(normalizedHomeserver, this.username, this.password);
      this.router.navigate(['/chat']);
    } catch (err: any) {
      console.error('Login error:', err);
      this.error.set(err.message || 'Login failed. Please check your credentials.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
