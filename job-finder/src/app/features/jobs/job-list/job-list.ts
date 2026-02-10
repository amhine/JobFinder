import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // JobItemComponent
  ],
  templateUrl: './job-list.html',
})
export class JobList implements OnInit {
  allJobsFetched: Job[] = [];
  jobs: Job[] = [];
  loading: boolean = false;
  searchQuery: string = '';
  currentPage: number = 1;
  totalJobs: number = 0;

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.jobService.searchJobs(this.searchQuery, this.currentPage).subscribe({
      next: (response: any) => {
        this.jobs = response.data;
        this.totalJobs = response.meta.total;
        this.loading = false;
        console.table(this.jobs)
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.loading = false;
      }
    });
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
