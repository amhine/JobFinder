import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Job } from '../models/job.model';


@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'job_favorites';

  getFavorites(): any[] {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    return [];
  }

  addToFavorites(job: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const favorites = this.getFavorites();
      if (!favorites.some(f => f.slug === job.slug)) {
        favorites.push(job);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      }
    }
  }

  removeFromFavorites(slug: string): void {
    if (isPlatformBrowser(this.platformId)) {
      let favorites = this.getFavorites();
      favorites = favorites.filter(f => f.slug !== slug);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    }
  }

  isFavorite(slug: string): boolean {
    return this.getFavorites().some(f => f.slug === slug);
  }
}
