import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationService } from '../../../core/services/application.service';
import { Application } from '../../../core/models/application.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// ✅ HADOU HOUMA L-IMPORTS LI KANOU KHASSIN:
import { timeout, finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './application-list.html'
})
export class ApplicationList implements OnInit {
  private appService = inject(ApplicationService);
  private platformId = inject(PLATFORM_ID);

  applications: Application[] = [];
  loading = true;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.appService.getApplications(userId).pipe(
          timeout(5000), // Stop l-request ila t-3ttlat ktar men 5s
          catchError((err: any) => {
            console.error('Mouchkil f l-API aw Timeout:', err);
            return of([] as Application[]); // Rjje3 array khawi f l-error
          }),
          finalize(() => this.loading = false) // Ḥiyd loading darori f l-akhir
        ).subscribe((data: Application[]) => {
          this.applications = data;
        });
      } else {
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  updateStatus(app: Application, newStatus: any) {
    if (app.id) {
      this.appService.updateApplication(app.id, { status: newStatus }).subscribe();
    }
  }

  updateNotes(app: Application) {
    if (app.id) {
      this.appService.updateApplication(app.id, { notes: app.notes }).subscribe(() => {
        alert("Note enregistrée");
      });
    }
  }

  deleteApp(id: number) {
    if (confirm("Supprimer ce suivi ?")) {
      this.appService.deleteApplication(id).subscribe(() => {
        this.applications = this.applications.filter(a => a.id !== id);
      });
    }
  }
}
