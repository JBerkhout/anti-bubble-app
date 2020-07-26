/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { tokenData } from "../../models/tokenData";

@Component({
    selector: 'mean-answer-form',
    templateUrl: './answer-form.component.html',
    styleUrls: ['./answer-form.component.css',
        '../../shared/general-styles.css']
})

export class AnswerFormComponent implements OnInit {
    getAnswerForm = this.fb.group({
        getAnswer: ['', []]
    });
    sendQuestionsForm = this.fb.group({
        getQuestion: ['', []]
    });
    tokenData: tokenData;
    alreadySubmitted: boolean = false;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private socketService: SocketIOService,
        private auth: AuthenticationService
    ) { }


    ngOnInit(): void {
        this.tokenData = this.auth.getTokenData();

        // Reactivate the option to answer after the teacher has deleted the answer.
        this.socketService.reactivateButton(() => {
            this.alreadySubmitted = false;
        });
    }

    /** This method lets students submit an answer to the teacher (digiboard). */
    sendAnswer() {
        if (this.getAnswerForm.get('getAnswer').value != '') {
            this.socketService.studentSubmit(this.getAnswerForm.get('getAnswer').value);
            this.getAnswerForm.get('getAnswer').setValue('');

            // Prevents students from spamming the teacher with answers.
            this.alreadySubmitted = true;
        } else {
            this.snackBar.open('Vul een antwoord in', 'X', { duration: 2500, panelClass: ['style-error'] });
        }
    }

    /** This method lets a teacher submit a question to all of the students in the session. */
    sendQuestion() {
        if (this.sendQuestionsForm.get('getQuestion').value != '') {
            this.socketService.sendQuestion(this.sendQuestionsForm.get('getQuestion').value);
            this.sendQuestionsForm.get('getQuestion').setValue('');
        } else {
            this.snackBar.open('Vul een onderwerp in', 'X', { duration: 2500, panelClass: ['style-error'] });
        }
    }
}
