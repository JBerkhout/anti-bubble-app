import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import {Router} from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'mean-class-overview',
  templateUrl: './class-overview.component.html',
  styleUrls: ['./class-overview.component.css',
              '../../shared/general-styles.css']
})
export class ClassOverviewComponent implements OnInit {

  classmates: User[];

  constructor(private auth: AuthenticationService, private router: Router) { }

  logoutButton() {
    return this.auth.logout();
  }

  ngOnInit() {
    this.auth.getAllClassmates().subscribe((data) => {
      this.classmates = data;
    });
  }
}