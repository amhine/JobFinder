import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';
import { Observable, BehaviorSubject, tap, map, of } from 'rxjs';

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
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.fetchUserById(userId).subscribe(user => {
          this.currentUserSubject.next(user);
        });
      }
    }
  }

  private fetchUserById(id: string): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map(user => {
        if (user) {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword as User;
        }
        return null;
      })
    );
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
            localStorage.setItem('userId', user.id.toString());

            const { password, ...userWithoutPassword } = user;
            this.currentUserSubject.next(userWithoutPassword as User);
          }
        }),
        map(users => users.length > 0)
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('userId');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('userId');
  }
  updateProfile(userId: string, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, data).pipe(
      tap(updatedUser => {
        const { password, ...userWithoutPassword } = updatedUser;
        this.currentUserSubject.next(userWithoutPassword as User);
      })
    );
  }
}
