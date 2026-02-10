import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // <-- Ajouté HttpParams
import { Observable } from 'rxjs';
import { Job } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'https://www.arbeitnow.com/api/job-board-api';

  constructor(private http: HttpClient) { }

  searchJobs(location?: string, page: number = 1): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    if (location) {
      params = params.set('location', location);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }
}
