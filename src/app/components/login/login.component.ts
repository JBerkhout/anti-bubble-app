/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * activities.component.ts
 * This file handles all the logic for logging in a user to the app. Only contains a method that calls the login()
 * method of the AuthenticationService.
 * @packageDocumentation
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { titleTrail } from '../../../../constants';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'mean-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css',
		'../../shared/general-styles.css']
})

export class LoginComponent implements OnInit {
	loginForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', Validators.required]
	});

	/**
	 * LoginComponent constructor.
	 * @param auth
	 * @param router
	 * @param fb
	 * @param snackBar
	 * @param titleService
	 */
	constructor(
		private auth: AuthenticationService,
		private router: Router,
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private titleService: Title
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	ngOnInit(): void {
		if (this.auth.isLoggedIn()) {
			this.router.navigate(['home']);
		}

		// Set page title.
		this.titleService.setTitle('Login' + titleTrail);
	}

	/**
	 * Method to login a user.
	 * @return
	 */
	loginUser() {
		let user = new User();
		user.email = this.loginForm.get('email').value;
		user.password = this.loginForm.get('password').value;
		this.auth.login(user).subscribe(() => {
			this.router.navigate(['home']);
		}, () => {
			this.snackBar.open('Onjuist wachtwoord of email.', 'X', { duration: 2500, panelClass: ['style-error'] });
		});
	}
}