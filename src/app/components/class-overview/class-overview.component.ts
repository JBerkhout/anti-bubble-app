/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

/**
 * @packageDocumentation
 * @module Components
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { titleTrail } from '../../../../constants';
import { User } from '../../models/user';
import { ClassesService } from '../../services/classes.service';
import { UserService } from '../../services/user.service';

/**
 * This class handles all the logic for the overview of a student's class where all the student's classmates are shown.
 * The class contains helper methods used in the HTML of the componenet to filter thorugh classmates and also a
 * method to open a MatDialog to leave a class, defined as a sub-component in the file.
 */
@Component({
	selector: 'class-overview-component',
	templateUrl: './class-overview.component.html',
	styleUrls: ['./class-overview.component.css',
		'../../shared/general-styles.css']
})

export class ClassOverviewComponent implements OnInit {
	public searchForm = this.fb.group({
		query: ['', []]
	});

	public classmates: User[];
	public userClass;
	public userDetails: User;

	/**
	 * ClassOverviewComponent constructor.
	 * @param classesService
	 * @param router
	 * @param fb
	 * @param dialog
	 * @param titleService
	 * @param userService
	 */
	constructor(
		private classesService: ClassesService,
		private router: Router,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private titleService: Title,
		private userService: UserService
	) { }

	/**
	 * Initialization method.
	 * @return
	 */
	public ngOnInit(): void {
		this.userService.profile().subscribe(user => {
			this.userDetails = user;
		});

		this.classesService.getClass().subscribe(data => {
			if (data.succes) {
				this.userClass = data.class;
				this.classmates = data.classmates;
			}
		});

		// Set page title.
		this.titleService.setTitle('Klas overzicht' + titleTrail);
	}

	/**
	 * Method to filter the students in a class.
	 * @return
	 */
	public search() {
		let query: string = this.searchForm.get('query').value.toLowerCase();
		let table = document.getElementById('table').childNodes;
		for (let i: number = 0; i < this.classmates.length; i++) {
			if (this.classmates[i].firstName.toLowerCase().includes(query) || this.classmates[i].lastName.toLowerCase().includes(query)) {
				(table[i + 1] as HTMLElement).style.display = '';
			} else {
				(table[i + 1] as HTMLElement).style.display = 'none';
			}
		}
	}

	/**
	 * Method to clear the filter so all students are displayed again.
	 * @return
	 */
	public clear() {
		this.searchForm.get('query').setValue('');
		let table = document.getElementById('table').childNodes;
		for (let i: number = 0; i < this.classmates.length; i++) {
			(table[i + 1] as HTMLElement).style.display = '';
		}
	}

	/**
	 * Method that opens the leave class dialog.
	 * @return
	 */
	public openLeaveClassDialog() {
		this.dialog.open(LeaveClassDialog, { data: { userId: this.userDetails._id, classId: this.userClass._id, classTitle: this.userClass.title, leaving: true }});
	}
}

/**
 * This class is defined as a sub-component of the ClassOverviewComponent and handles the MatDialog for when a user
 * wants to leave their class.
 */
@Component({
	selector: 'leave-class-dialog',
	templateUrl: 'leave-class-dialog.html'
})

export class LeaveClassDialog {

	/**
	 * LeaveClassDialog constructor.
	 * @param classesService
	 * @param dialog
	 * @param dialogRef
	 * @param snackBar
	 * @param data
	 */
	constructor(
		private classesService: ClassesService,
		private dialog: MatDialog,
		private dialogRef: MatDialogRef<LeaveClassDialog>,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }


	/**
	 * Method so the current user can leave his class.
	 * @return
	 */
	public leaveClass() {
		this.classesService.leaveClass(this.data.userId, this.data.classId, this.data.leaving).subscribe(data => {
			if (data.succes) {
				this.dialogRef.close();
				this.snackBar.open(data.message, 'X', { duration: 2500, panelClass: ['style-succes'] }).afterDismissed().subscribe(() => {
					window.location.reload();
				});
			} else {
				this.snackBar.open('Er is iets fout gegaan, probeer het later opnieuw.', 'X', { duration: 2500, panelClass: ['style-error'] });
			}
		});
	}
}
