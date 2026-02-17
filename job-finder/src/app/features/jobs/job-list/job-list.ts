import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';
import { FavoriteService } from '../../../core/services/favorite.service';
import { FavoriteOffer } from '../../../core/models/favorite.model';
import { FavoriteActions } from '../../../core/store/actions/favorite.actions';
import { selectFavorites } from '../../../core/store/selectors/favorite.selectors';

interface JobWithFavorite extends Job {
  isFavorite?: boolean;
}

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './job-list.html',
})
export class JobList implements OnInit {
  private store = inject(Store);
  private jobService = inject(JobService);
  private favoriteService = inject(FavoriteService);

  jobs: JobWithFavorite[] = [];
  favoritesFromStore: FavoriteOffer[] = [];

  loading: boolean = false;
  searchQuery: string = '';
  searchLocation: string = '';
  currentPage: number = 1;
  totalJobs: number = 0;

  ngOnInit() {
    this.loadJobs();

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const userId = user.id;

      this.store.dispatch(FavoriteActions.loadFavorites({ userId }));

      this.store.select(selectFavorites).subscribe((favs: FavoriteOffer[]) => {
        this.favoritesFromStore = favs;
        this.updateJobsFavoriteStatus();
      });
    }
  }

  loadJobs() {
    this.loading = true;
    this.jobService.searchJobs(this.searchQuery, this.searchLocation, this.currentPage).subscribe({
      next: (response: any) => {
        const jobData = response.data || response;

        this.jobs = jobData.slice(0, 10).map((job: Job) => ({
          ...job,
          isFavorite: false
        }));

        this.updateJobsFavoriteStatus();
        this.totalJobs = response.meta?.total || jobData.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.loading = false;
      }
    });
  }

  updateJobsFavoriteStatus() {
    if (!this.jobs.length) return;

    this.jobs = this.jobs.map(job => ({
      ...job,
      isFavorite: this.favoritesFromStore.some(f => f.offerId === job.slug)
    }));
  }

  toggleFavorite(job: Job) {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert("Veuillez vous connecter pour ajouter des favoris");
      return;
    }
    const user = JSON.parse(userStr);

    const favoriteRecord = this.favoritesFromStore.find(f => f.offerId === job.slug);

    if (favoriteRecord) {
      if (favoriteRecord.id) {
        this.store.dispatch(FavoriteActions.removeFavorite({ id: favoriteRecord.id }));
      }
    } else {
      const favoriteData: Omit<FavoriteOffer, 'id'> = {
        userId: user.id,
        offerId: job.slug,
        title: job.title,
        company: job.company_name,
        location: job.location,
        url: job.url || ''
      };
      this.store.dispatch(FavoriteActions.addFavorite({ favorite: favoriteData }));
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.loadJobs();
  }

  nextPage() {
    this.currentPage++;
    this.loadJobs();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadJobs();
    }
  }
}
