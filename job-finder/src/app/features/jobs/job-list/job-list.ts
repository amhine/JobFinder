import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Job } from '../../../core/models/job.model';
import { FavoriteOffer } from '../../../core/models/favorite.model';
import { Application } from '../../../core/models/application.model';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
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
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private applicationService = inject(ApplicationService);

  allJobs: JobWithFavorite[] = [];
  filteredJobs: JobWithFavorite[] = [];
  jobs: JobWithFavorite[] = [];

  favoritesFromStore: FavoriteOffer[] = [];

  loading = false;
  searchQuery = '';
  searchLocation = '';

  apiPage = 1;
  localPage = 1;
  localPageSize = 10;

  get totalLocalPages(): number {
    return Math.ceil(this.filteredJobs.length / this.localPageSize);
  }

  ngOnInit() {
    this.loadJobs();

    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.store.dispatch(FavoriteActions.loadFavorites({ userId }));
        this.store.select(selectFavorites).subscribe((favs: FavoriteOffer[]) => {
          this.favoritesFromStore = favs;
          this.updateJobsFavoriteStatus();
        });
      }
    }
  }

  loadJobs() {
    this.loading = true;

    this.jobService.getJobs(this.apiPage).pipe(
      timeout(15000),
      catchError(err => {
        console.error('Erreur API:', err);
        return of({ data: [], meta: { total: 0 } });
      }),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (response: any) => {
        const jobData = response.data || response;
        this.allJobs = jobData.map((job: any) => ({
          ...job,
          isFavorite: this.favoritesFromStore.some(f => f.offerId === job.slug)
        }));
        this.applyFilter();
      }
    });
  }

  applyFilter() {
    const query = this.searchQuery.toLowerCase().trim();
    const location = this.searchLocation.toLowerCase().trim();

    this.filteredJobs = this.allJobs.filter(job => {
      const matchQuery = !query ||
        job.title.toLowerCase().includes(query) ||
        job.company_name.toLowerCase().includes(query);

      const matchLocation = !location ||
        job.location.toLowerCase().includes(location);

      return matchQuery && matchLocation;
    });

    this.localPage = 1;
    this.updateLocalPage();
  }

  updateLocalPage() {
    const start = (this.localPage - 1) * this.localPageSize;
    const end = start + this.localPageSize;
    this.jobs = this.filteredJobs.slice(start, end);
  }

  onSearch() {
    this.applyFilter();
  }

  nextPage() {
    if (this.localPage < this.totalLocalPages) {
      this.localPage++;
      this.updateLocalPage();
    } else {
      this.apiPage++;
      this.localPage = 1;
      this.loadJobs();
    }
  }

  prevPage() {
    if (this.localPage > 1) {
      this.localPage--;
      this.updateLocalPage();
    } else if (this.apiPage > 1) {
      this.apiPage--;
      this.loadJobs();
    }
  }

  updateJobsFavoriteStatus() {
    this.allJobs = this.allJobs.map(job => ({
      ...job,
      isFavorite: this.favoritesFromStore.some(f => f.offerId === job.slug)
    }));
    this.applyFilter();
  }

  toggleFavorite(job: Job) {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (!userId) { alert("Veuillez vous connecter pour ajouter des favoris"); return; }

      const favoriteRecord = this.favoritesFromStore.find(f => f.offerId === job.slug);
      if (favoriteRecord?.id) {
        this.store.dispatch(FavoriteActions.removeFavorite({ id: favoriteRecord.id }));
      } else {
        this.store.dispatch(FavoriteActions.addFavorite({
          favorite: {
            userId, offerId: job.slug, title: job.title,
            company: job.company_name, location: job.location,
            created_at: job.created_at, description: job.description,
            tags: job.tags, url: job.url || ''
          }
        }));
        this.router.navigate(['/favorites']);
      }
    }
  }

  applyToJob(job: Job) {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (!userId) { alert("Veuillez vous connecter pour postuler"); return; }

      this.applicationService.getApplications(userId).subscribe({
        next: (existingApps) => {
          if (existingApps.some(app => app.offerId === job.slug)) {
            alert("Vous avez déjà ajouté cette offre !");
            return;
          }
          this.applicationService.addApplication({
            userId, offerId: job.slug, apiSource: 'Arbeitnow',
            title: job.title, company: job.company_name,
            location: job.location, url: job.url,
            status: 'en_attente', notes: '',
            dateAdded: new Date().toISOString()
          }).subscribe({
            next: () => {
              alert("Candidature ajoutée !");
              setTimeout(() => this.router.navigate(['/applications']), 300);
            },
            error: () => alert("Erreur lors de l'ajout")
          });
        }
      });
    }
  }
}
