import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from "rxjs";
import { Milestone } from '../models/milestone';

@Injectable({
  providedIn: 'root'
})
export class MilestoneUpdatesService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  public updateMilestone(milestone: Milestone, value: Number): Observable<any> {
    return this.http.post('https://localhost:3000/user/milestone', { milestone: milestone, value: value }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
  }

  public updateRecent(value: String): Observable<any> {
    return this.http.post('https://localhost:3000/user/recentMilestones', { value: value }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') } });
  }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */