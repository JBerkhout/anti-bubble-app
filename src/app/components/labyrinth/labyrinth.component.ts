import { Component, OnInit, HostListener, Input } from '@angular/core';
import { User } from "../../models/user";
import { Router } from "@angular/router";
import { SessionService } from '../../services/session.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'mean-labyrinth',
  templateUrl: './labyrinth.component.html',
  styleUrls: ['./labyrinth.component.css',
    '../../shared/general-styles.css']
})
export class LabyrinthComponent implements OnInit {

  userDetails: User;
  startedLabyrinth: boolean;
  nextQuestionDisabled: boolean;
  questions = [];
  questionOptions = [];
  part: Number;
  answers: [{ question: any, answer: any }] = [,];
  currentQuestion;
  optionSelected;
  questionLoaded: boolean = false;

  @HostListener("change") function() {
    if (this.checkBoxCount() == 0) {
      this.nextQuestionDisabled = true;
    } else {
      this.nextQuestionDisabled = false;
    }
  };

  constructor(private router: Router, private sessionService: SessionService, private auth: AuthenticationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Start the labyrinth in part 1.
    this.part = 1;
  }


  /** Function that saves answers the user gave and sets their bubble initialization to true so they can join a session after this. */
  performedLabyrinth() {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;

      this.sessionService.performedLabyrinth().subscribe(data => {
        console.log(data.succes);
        if (data.succes) {  // Labyrinth boolean is set to true. Player now has a bubble and can join activity sessions.
          this.sessionService.saveAnswers(this.answers).subscribe(() => { // Saves the answers in the database.
            this.router.navigate(['home']);
          });
        } else {
          // TODO: opvangen fout tijdens doorlopen van doolhof
        }
      });
    });
  }

  /** Function that starts the labyrinth. */
  startLabyrinth() {
    this.startedLabyrinth = true; // Shows the question screen due to ngIfs in the HTML.
    this.sessionService.getShuffledQuestions(1).subscribe(questions => { // Get the part 1 questions from the database.
      this.questions = questions;
      this.nextQuestion(null); // Show the first question, previous question does not exist so its null.
    })
  }

  paused() {
    this.snackBar.open('Doolhof gepauzeerd. Zorg dat je het voor de volgende les hebt afgemaakt.', 'X', { duration: 2500, panelClass: ['style-warning'], }).afterDismissed().subscribe(() => {
      // TODO: opslaan waar je was
      this.router.navigate(['home']);
    });
  }

  /** Function that shows the next question on the screen. */
  nextQuestion(prevQuestion) {
    this.nextQuestionDisabled = true;
    this.questionLoaded = false;
    if (this.questions.length === 0) {
      if (this.part === 1) {
        // If at the end of part 1, go to part 2.
        this.part = 2;
        this.sessionService.getShuffledQuestions(2).subscribe(questions => {
          this.questions = questions;
          this.nextQuestion(prevQuestion);
        });
      } else {
        // If at the end of part 2, finish labyrinth.
        this.saveQuestion(prevQuestion);
        this.performedLabyrinth(); //TODO: Make screen that tells the user they have finished the labyrinth
      }
    } else {
      let question = this.questions.shift(); // Get next question from array.
      this.currentQuestion = question;

      if (prevQuestion != null) {
        this.saveQuestion(prevQuestion); // If its not the first question, save previous question.
      }

      this.showQuestion(question); // Show the qustion on the screen.
    }
  }

  /** Function that counts how many checkboxes have been checked. */
  checkBoxCount() {
    let checkboxes: any = document.getElementsByClassName('option'); // Get all checkboxes in an array.
    let count = 0;
    for (let i = 0; i < checkboxes.length; i++) { // Loop over all the checkboxes.
      if (checkboxes[i].checked) {
        count++; // If the checkbox is checked, count++.
      }
    }
    return count;
  }

  /** Function that saves a question to this.answers. */
  saveQuestion(question) {
    // let checkboxes: any = document.getElementsByClassName('option'); // Get all checkboxes in an array.
    // let result = [];
    // for (let i = 0; i < checkboxes.length; i++) { // Loop over all the checkboxes.
    //   result.push(checkboxes[i].checked); // Save checked in result array.
    // }
    this.answers.push({ question: question, answer: this.optionSelected }); // Push the result with its corresponding question to this.answers.
  }

  /** Function that shows a question on the screen. */
  showQuestion(question) {
    document.getElementById('question').innerHTML = question.question; // Set question title.
    let radioDiv = document.getElementsByClassName('radioOptions')[0];
    let radioGroup = document.createElement("mat-radio-group");
    this.questionOptions = question.choices;
    this.questionLoaded = true;

    // let radioButton = document.getElementsByClassName("radioButton")[0];
    // let options = "";
    let radioButton = document.getElementsByClassName("radioButton");
    for (let i = 0; i < question.choices.length; i++) { // For each question...
      if (question.choices[i].startsWith("/assets/")) {
        //let radioButton = document.createElement("mat-radio-button");
        setTimeout(() => {
          //options += `<img src="${question.choices[i]}" id="image${i}" (click)="selectedOption()">`// Add a checkbox/radiobutton to options.
          let image = document.createElement("img");
          image.setAttribute("width", "200px");
          image.setAttribute("height", "200px");
          image.addEventListener("click", this.selectedOption);
          image.id = "image" + i;
          image.setAttribute("src", question.choices[i]);
          radioButton[i].appendChild(image);
        }, 1);
        //radioGroup.appendChild(radioButton);
      } else {
        setTimeout(() => {
          radioButton[i].appendChild(document.createTextNode(question.choices[i]));
        }, 1);
      }
    } //else {
    //     let radioButton = document.createElement("mat-radio-button");
    //     radioButton.innerHTML += `${question.choices[i]}<br>`;
    //     // options += `${question.choices[i]}<br>` // Add a checkbox/radiobutton to options.  <input type="${type}" class="option" name="options"/>
    //     radioGroup.appendChild(radioButton);
    //   }
    // }
    // radioDiv.appendChild(radioGroup);
    // //radioGroup.innerHTML = options; // Place all checkboxes/radiobuttons on the screen.

    // // Go over all images and add click event to check/uncheck checkboxes.
    // for (let i = 0; i < question.choices.length; i++) {
    //   let image = document.getElementById(`image${i}`);
    //   if (image != null) {
    //     image.setAttribute("width", "200px");
    //     image.setAttribute("height", "200px");
    //     image.addEventListener("click", 
    //       this.selectedOption )
    //   }
    // }
  }

  selectedOption() {
    this.nextQuestionDisabled = false;
  }
}
