/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

import { PasswordRecoveryComponent } from './password-recovery.component';

describe('PasswordRecoveryComponent', () => {
	let component: PasswordRecoveryComponent;
	let fixture: ComponentFixture<PasswordRecoveryComponent>;
	const passwordRecoveryServiceStub: jasmine.SpyObj<PasswordRecoveryService> = jasmine.createSpyObj(
		'passwService',
		['sendEmail']
	);
	const snackBarStub: jasmine.SpyObj<MatSnackBar> = jasmine.createSpyObj(
		'snackBar',
		['open']
	);

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PasswordRecoveryComponent],
			imports: [RouterModule.forRoot([]), ReactiveFormsModule, MatSnackBarModule],
			providers: [
				{
					provide: PasswordRecoveryService,
					useValue: passwordRecoveryServiceStub
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PasswordRecoveryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('Component successfully created', () => {
		expect(component).toBeTruthy();
	});

	it('should render form email input', () => {
		const element = fixture.nativeElement;

		expect(element.querySelector('.password-recovery-form')).toBeTruthy();
		expect(element.querySelector('input')).toBeTruthy();
		expect(element.querySelector('button')).toBeTruthy();
	});

	it('should return model invalid when form is empty', () => {
		expect(component.passwordRecoveryForm.valid).toBeFalsy();
	});

	it('should validate email input as required', () => {
		const email = component.passwordRecoveryForm.controls.email;

		expect(email.valid).toBeFalsy();
		expect(email.errors.required).toBeTruthy();
	});

	it('should validate email format', () => {
		const email = component.passwordRecoveryForm.controls.email;
		email.setValue('test');
		const errors = email.errors;

		expect(errors.required).toBeFalsy();
		expect(errors.email).toBeTruthy();
		expect(email.valid).toBeFalsy();
	});

	it('should invoke passwordRecoveryService when form is valid', () => {
		const email = component.passwordRecoveryForm.controls.email;
		email.setValue('test@test.nl');

		passwordRecoveryServiceStub.sendEmail.and.returnValue(of());

		fixture.detectChanges();

		fixture.nativeElement.querySelector('button').click();

		expect(passwordRecoveryServiceStub.sendEmail.calls.any()).toBeTruthy();
		expect(passwordRecoveryServiceStub.sendEmail).toHaveBeenCalledWith(email.value);
	});

});