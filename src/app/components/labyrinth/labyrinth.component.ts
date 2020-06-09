import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { Router } from "@angular/router";
import { SessionService } from '../../services/session.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'mean-labyrinth',
  templateUrl: './labyrinth.component.html',
  styleUrls: ['./labyrinth.component.css',
    '../../shared/general-styles.css']
})
export class LabyrinthComponent implements OnInit {

  userDetails: User;
  startedLabyrinth: boolean;
  firstQuestion: boolean = true;
  lastSelected;
  interval;
  questions = [];
  part: Number;

  constructor(private router: Router, private sessionService: SessionService, private auth: AuthenticationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.part = 1;
  }

  performedLabyrinth() {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;

      this.sessionService.performedLabyrinth(this.userDetails.email).subscribe(data => {
        if (data.succes) {  // labyrinth boolean is set to true. Player now has a bubble and can join activity sessions.
          this.router.navigate(['home']);
        } else {
          // TODO: opvangen fout tijdens doorlopen van doolhof
        }
      });
    });
  }

  logoutButton() {
    return this.auth.logout();
  }

  startLabyrinth() {
    this.startedLabyrinth = true;
    this.sessionService.getShuffledQuestions(1).subscribe(questions => {
      this.questions = questions;
      this.startTimer(300); // labyrinth activity is 5 minutes, therefore 300 seconds
      this.nextQuestion();
    })
  }

  startTimer(time: number) {
    setTimeout(() => {
      // TODO: iets
    }, time * 1000);
    this.interval = setInterval(() => {
      if (time > 0) {
        time -= 1;
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) {
          document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:0${seconds}</strong>`; // add extra 0 before single digits 
        } else {
          document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:${seconds}</strong>`;
        }
      } else {
        clearInterval(this.interval);
        this.snackBar.open('De tijd is op. Je wordt omgeleid naar de homepage.', 'X', { duration: 2500, panelClass: ['style-warning'], });
        this.performedLabyrinth(); // TODO: redirect naar home gaan te snel?
      }
    }, 1000);
  }

  onItemChange(value: string) {
    this.lastSelected = value; // get selected radio button value
  }

  nextQuestion() {
    if (this.questions.length === 0) {
      if (this.part === 1) {
        this.part = 2;
        this.sessionService.getShuffledQuestions(2).subscribe(questions => {
          this.questions = questions;
          this.nextQuestion();
        });
      } else {
        this.saveQuestion();
        console.log("labyrinth finished");
      }
    } else {
      this.saveQuestion();

      this.showQuestion();

      // if (this.lastSelected == undefined) {
      //   if (this.firstQuestion) { // do not save answers when displaying the first question
      //     this.firstQuestion = false;
      //   } else {
      //     this.snackBar.open('Vul een antwoord in', 'X', { duration: 2500, panelClass: ['style-error'], });
      //   }
      // } else {
      //   console.log("Je hebt gekozen voor: " + this.lastSelected); //TODO: sla dit antwoord ergens op
      //   // TODO: laat volgende vraag (en opties) zien
      // }
    }
  }

  saveQuestion() {
    let checkboxes: any = document.getElementsByClassName('option');
    for (let i = 0; i < checkboxes.length; i++) {
      console.log(checkboxes[i].checked)
    } // TODO: save answers somewhere
  }

  showQuestion() {
    // Show question on screen
    let question = this.questions.shift();

    document.getElementById('question').innerHTML = question.question;

    let radioGroup = document.getElementsByClassName('radioButtonOptions')[0];
    let options = "";
    let type = "";
    if (question.multipleAnswers) {
      type = "checkbox";
    } else {
      type = "radio";
    }
    for (let i = 0; i < question.choices.length; i++) {
      //options += `<mat-radio-button value="${question.choices[i]}" #optie${i} (change)="onItemChange(optie${i}.value)">${question.choices[i]}</mat-radio-button><br>`
      options += `<input type="${type}" class="option" name="options">${question.choices[i]}</input><br>`
    }
    radioGroup.innerHTML = options;
  }
}
