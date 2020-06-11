import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import { Role } from 'src/app/models/role';

@Component({
    selector: 'mean-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css',
        '../../shared/general-styles.css']
})

export class RegisterComponent implements OnInit {
    registerForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email], this.auth.uniqueEmailValidator()],
        role: ['', Validators.required],
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required],
        classCode: ['',],
    },
    {
        validator: this.passwordMatchValidator
    });

    constructor(private auth: AuthenticationService, private router: Router, private fb: FormBuilder) { }

    ngOnInit() { }

    // TODO: Add check if register is complete before redirecting
    registerUser() { 
        let user = new User();
        user.firstName = this.registerForm.get('firstName').value;
        user.lastName = this.registerForm.get('lastName').value;
        user.email = this.registerForm.get('email').value;
        user.role = this.registerForm.get('role').value;
        user.password = this.registerForm.get('password').value;

        this.auth.register(user).subscribe(() => {
            this.router.navigate(['login']);
        });
    }

    passwordMatchValidator(form: FormGroup) {
        let password = form.get('password').value;
        let repeatPassword = form.get('repeatPassword').value;
        if (password != repeatPassword) {
            form.get('repeatPassword').setErrors({ noPasswordMatch: true });
        }
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */