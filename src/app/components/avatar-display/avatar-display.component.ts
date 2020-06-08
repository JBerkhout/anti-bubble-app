import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from "../../models/user";
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'mean-avatar-display',
  templateUrl: './avatar-display.component.html',
  styleUrls: ['./avatar-display.component.css']
})
export class AvatarDisplayComponent implements OnInit {
  userDetails: User;

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.showAvatar();
  }

  // Function to show the avatar, taking the object from the database
  showAvatar(){
    this.auth.profile().subscribe(user => {
    this.userDetails = user
    document.getElementById("haar1").setAttribute("src", this.userDetails.avatar.haar?.fullImage2);
    document.getElementById("lichaam").setAttribute("src", this.userDetails.avatar.lichaam.fullImage);
    document.getElementById("broek").setAttribute("src", this.userDetails.avatar.broek.fullImage);
    document.getElementById("shirt").setAttribute("src", this.userDetails.avatar.shirt.fullImage);
    document.getElementById("schoenen").setAttribute("src", this.userDetails.avatar.schoenen?.fullImage);
    document.getElementById("bril").setAttribute("src", this.userDetails.avatar.bril?.fullImage);
    document.getElementById("haar2").setAttribute("src", this.userDetails.avatar.haar?.fullImage);
    document.getElementById("hoofddeksel").setAttribute("src", this.userDetails.avatar.hoofddeksel?.fullImage);
    document.getElementById("medaille").setAttribute("src", this.userDetails.avatar.medaille?.fullImage); 
    });
}

@Output() myEvent = new EventEmitter();

}