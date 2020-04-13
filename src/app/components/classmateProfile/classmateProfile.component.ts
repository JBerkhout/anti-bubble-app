import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';

@Component({
  selector: 'mean-classmateProfile',
  templateUrl: './classmateProfile.component.html',
  styleUrls: ['./classmateProfile.component.css',
              '../../shared/general-styles.css']
})
export class ClassmateProfileComponent implements OnInit {

  userDetails: User;

  constructor(private authenticationService: AuthenticationService) { }

  logoutButton() {
    return this.authenticationService.logout();
  }

  ngOnInit() {
    this.authenticationService.profile().subscribe(user => {
      this.userDetails = user;
  }, (err) => {
      console.error(err);
  });
  }

}