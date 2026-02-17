import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.html',
})
export class UserProfile implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  profileForm: FormGroup;
  loading = false;
  message = { type: '', text: '' };
  userId: string | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid && this.userId) {
      this.loading = true;

      this.authService.updateProfile(this.userId, this.profileForm.value).subscribe({
        next: () => {
          this.message = {
            type: 'success',
            text: 'Profil mis à jour avec succès !'
          };
          this.loading = false;

          setTimeout(() => {
            this.message = { type: '', text: '' };
          }, 3000);
        },
        error: (err) => {
          this.message = {
            type: 'error',
            text: 'Erreur lors de la mise à jour.'
          };
          this.loading = false;

          setTimeout(() => {
            this.message = { type: '', text: '' };
          }, 3000);
        }
      });
    }
  }
  onDeleteAccount() {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.');

    if (confirmation && this.userId) {
      this.loading = true;
      this.authService.deleteAccount(this.userId).subscribe({
        next: () => {
          console.log('Compte supprimé');
        },
        error: (err) => {
          this.message = { type: 'error', text: 'Erreur lors de la suppression du compte.' };
          this.loading = false;
        }
      });
    }
  }
}
