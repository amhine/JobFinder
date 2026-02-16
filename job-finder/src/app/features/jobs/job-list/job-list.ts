import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';
import { FavoriteService } from '../../../core/services/favorite.service';

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
  private jobService = inject(JobService);
  private favoriteService = inject(FavoriteService);

  jobs: JobWithFavorite[] = [];
  loading: boolean = false;
  searchQuery: string = '';
  searchLocation: string = '';
  currentPage: number = 1;
  totalJobs: number = 0;

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.jobService.searchJobs(this.searchQuery, this.searchLocation, this.currentPage).subscribe({
      next: (response: any) => {
        const firstTenJobs = response.data.slice(0, 10);

        this.jobs = firstTenJobs.map((job: Job) => ({
          ...job,
          isFavorite: this.favoriteService.isFavorite(job.slug)
        }));

        this.totalJobs = response.meta.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.loading = false;
      }
    });
  }

  toggleFavorite(job: JobWithFavorite) {
    job.isFavorite = !job.isFavorite;
    if (job.isFavorite) {
      this.favoriteService.addToFavorites(job);
    } else {
      this.favoriteService.removeFromFavorites(job.slug);
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
