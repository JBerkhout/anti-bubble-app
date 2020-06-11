import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

@Component({
  selector: 'mean-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css',
              '../../shared/general-styles.css']
})
export class PasswordRecoveryComponent implements OnInit {
  passwordRecoveryForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private passwordRecoveryService: PasswordRecoveryService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit() { }

  /** Function that sends a recovery email to the filled in email address. */
  sendEmail() {
    console.log("sending email...");
    let email = this.passwordRecoveryForm.get('email').value; // Get email from the input field.

    // Send email, data returns whether the action was a succes and a message to show to the user.
    this.passwordRecoveryService.sendEmail(email).subscribe(data => {
      if (!data.succes){
        this.snackBar.open(data.message, 'X' , { duration: 2500, panelClass: ['style-error'] });
      } else {
        this.snackBar.open(data.message, 'X' , { duration: 2500, panelClass: ['style-succes']})
      }
    });
  }
}