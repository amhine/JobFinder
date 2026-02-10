import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  authService = inject(AuthService);
  currentUser$: Observable<User | null> = this.authService.currentUser$;

  logout() {
    this.authService.logout();
  }
}
