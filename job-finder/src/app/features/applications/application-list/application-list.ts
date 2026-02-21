import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationService } from '../../../core/services/application.service';
import { Application } from '../../../core/models/application.model';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { timeout, finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './application-list.html'
})
export class ApplicationList implements OnInit {
  private appService = inject(ApplicationService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  applications: Application[] = [];
  loading = true;

  ngOnInit() {
    this.loadUserApplications();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUserApplications();
    });
  }

  loadUserApplications() {
    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.loading = true;
        this.appService.getApplications(userId).pipe(
          timeout(5000),
          catchError(() => of([])),
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        ).subscribe(data => {
          this.applications = data;
          this.cdr.detectChanges();
        });
      } else {
        this.loading = false;
        this.cdr.detectChanges();
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

  deleteApp(id: number | undefined) {
    if (!id) return;

    if (confirm("Supprimer ce suivi ?")) {
      this.appService.deleteApplication(id).subscribe({
        next: () => {
          this.applications = this.applications.filter(a => a.id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Erreur lors de la suppression:", err);
          alert("Erreur lors de la suppression");
        }
      });
    }
  }
}
