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
import { FavoriteService } from '../../../core/services/favorite.service';
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

  jobs: JobWithFavorite[] = [];
  favoritesFromStore: FavoriteOffer[] = [];

  loading: boolean = false;
  searchQuery: string = '';
  searchLocation: string = '';
  currentPage: number = 1;
  totalJobs: number = 0;

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

    this.jobService.searchJobs(this.searchQuery, this.searchLocation, this.currentPage).pipe(
      timeout(5000), // 👈 Ila فات 5 d-thwani o majatch data, ghadi i-t-7iyd loading
      catchError(err => {
        console.error('API t-3ttlat bzaf aw fiha error');
        return of({ data: [], meta: { total: 0 } }); // Rjje3 array khawi
      }),
      finalize(() => this.loading = false) // 👈 Darori had l-stter: kiy-7iyd loading f ga3 l-7alat
    ).subscribe({
      next: (response: any) => {
        const jobData = response.data || response;
        this.jobs = jobData.slice(0, 10).map((job: any) => ({
          ...job,
          isFavorite: this.favoritesFromStore.some(f => f.offerId === job.slug)
        }));
        this.totalJobs = response.meta?.total || jobData.length;
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
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert("Veuillez vous connecter pour ajouter des favoris");
        return;
      }

      const favoriteRecord = this.favoritesFromStore.find(f => f.offerId === job.slug);

      if (favoriteRecord) {
        if (favoriteRecord.id) {
          this.store.dispatch(FavoriteActions.removeFavorite({ id: favoriteRecord.id }));
        }
      } else {
        const favoriteData: Omit<FavoriteOffer, 'id'> = {
          userId: userId,
          offerId: job.slug,
          title: job.title,
          company: job.company_name,
          location: job.location,
          created_at: job.created_at,
          description: job.description,
          tags: job.tags,
          url: job.url || ''
        };

        this.store.dispatch(FavoriteActions.addFavorite({ favorite: favoriteData }));
        this.router.navigate(['/favorites']);
      }
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

  applyToJob(job: Job) {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert("Veuillez vous connecter pour postuler");
        return;
      }

      // 1️⃣ Qleb f l-API wach had l-user déjà postula l-had l-offre b-debt
      this.applicationService.getApplications(userId).subscribe({
        next: (existingApps) => {
          // Check wach l-offerId dyal had l-job déjà f l-list dyal l-user
          const alreadyApplied = existingApps.some(app => app.offerId === job.slug);

          if (alreadyApplied) {
            // ❌ Ila déjà kayn, n-3tiwh alert o n-حبسو
            alert("Vous avez déjà ajouté cette offre à votre suivi de candidatures !");
          } else {
            // ✅ Ila makanche, n-zidouh
            const applicationData: Application = {
              userId: userId,
              offerId: job.slug,
              apiSource: 'Arbeitnow',
              title: job.title,
              company: job.company_name,
              location: job.location,
              url: job.url,
              status: 'en_attente',
              notes: '',
              dateAdded: new Date().toISOString()
            };

            this.applicationService.addApplication(applicationData).subscribe({
              next: () => {
                alert("Candidature ajoutée au suivi !");
                this.router.navigate(['/applications']);
              },
              error: (err) => alert("Erreur lors de l'ajout")
            });
          }
        },
        error: (err) => {
          console.error("Erreur lors de la vérification:", err);
        }
      });
    }
  }


}
