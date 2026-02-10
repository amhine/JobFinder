import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/job-list/job-list.component').then(m => m.JobListComponent)
  },

  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorite-list/favorite-list.component').then(m => m.FavoriteListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'applications',
    loadComponent: () => import('./features/applications/application-list/application-list.component').then(m => m.ApplicationListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/user-profile/user-profile.component').then(m => m.UserProfileComponent),
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: '' }
];
