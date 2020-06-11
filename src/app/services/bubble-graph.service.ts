import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {CookieService} from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class BubbleGraphService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  public updateGraph(knowledge : Number, diversity : Number): Observable<any> {
    return this.http.post("https://localhost:3000/user/updateGraph", {knowledgeScore : knowledge, diversityScore : diversity}, {headers :  { Authorization: 'Bearer ' + this.cookie.get('mean-token')}});
  }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */