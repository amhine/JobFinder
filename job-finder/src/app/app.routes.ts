import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },

  {
    path: 'jobs',
    loadComponent: () => import('./features/jobs/job-list/job-list').then(m => m.JobList)
  },

  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorite-list/favorite-list').then(m => m.FavoriteList),
    canActivate: [authGuard]
  },
  {
    path: 'applications',
    loadComponent: () => import('./features/applications/application-list/application-list').then(m => m.ApplicationList),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/user-profile/user-profile').then(m => m.UserProfile),
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: '' }
];
