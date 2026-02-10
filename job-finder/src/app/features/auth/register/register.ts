import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterForm } from './register-form/register-form';


@Component({
  selector: 'app-register',
  imports: [CommonModule, RegisterForm, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string = '';

  onRegisterUser(userData: any) {
    this.authService.register(userData).subscribe({
      next: (response: any) => {
        console.log('Inscription réussie', response);
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Erreur inscription', err);
        this.errorMessage = "Une erreur est survenue lors de l'inscription.";
      }
    });
  }
}
