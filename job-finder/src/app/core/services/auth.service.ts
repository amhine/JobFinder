import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private apiUrl = 'http://localhost:3000/users';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if (this.isBrowser) {
      const user = this.getUserFromStorage();
      this.currentUserSubject.next(user);
    }
  }

  register(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  login(credentials: { email: string; password: string }): Observable<boolean> {
    return this.http
      .get<User[]>(
        `${this.apiUrl}?email=${credentials.email}&password=${credentials.password}`
      )
      .pipe(
        tap(users => {
          if (users.length > 0 && this.isBrowser) {
            const user = users[0];
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        map(users => users.length > 0)
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('user');
  }

  private getUserFromStorage(): User | null {
    if (!this.isBrowser) return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
