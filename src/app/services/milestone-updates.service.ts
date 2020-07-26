/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Milestone } from '../models/milestone';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MilestoneUpdatesService {

    constructor(private http: HttpClient, private cookie: CookieService) { }

    /** Method to do a POST request to update a given milestone to a given value. */
    public updateMilestone(milestone: Milestone, value: Number): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/user/milestone`, { milestone: milestone, value: value }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
    }

    /** Method to do a POST request to update the recent milestone to the given value. */
    public updateRecent(value: String): Observable<any> {
        return this.http.post(`${environment.ENDPOINT}/user/recentMilestones`, { value: value }, { headers: { Authorization: 'Bearer ' + this.cookie.get('mean-token') }});
    }
}