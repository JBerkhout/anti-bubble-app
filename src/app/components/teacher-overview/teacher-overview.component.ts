import { Component, OnInit, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';
import { FormBuilder, Validators } from '@angular/forms';
import { Class } from 'src/app/models/classes';
import { ClassesService } from 'src/app/services/classes.service';

@Component({
    selector: 'mean-teacher-overview',
    templateUrl: './teacher-overview.component.html',
    styleUrls: ['./teacher-overview.component.css',
        '../../shared/general-styles.css']
})
export class TeacherOverviewComponent implements OnInit {
    userDetails: User;
    loading = true;
    classIds = [];
    names = [];
    currentClass;
    classmates: User[];
    classForm = this.fb.group({
        classTitle: ['', Validators.required],
        classLevel: ['', Validators.required],
        classYear: ['', Validators.required]
    });
    openform = false;
    selectklas = false;

    constructor(private authenticationService: AuthenticationService, private classService: ClassesService, private fb: FormBuilder) { }

    ngOnInit(): void {
        this.authenticationService.profile().subscribe(user => {
            this.userDetails = user;
        });
        this.classService.getClassIds().subscribe((ids) => {
            this.classIds = ids.classIds;
            this.getClass(this.classIds[0]._id);
            this.getClassNames();
        });
    }

    getClass(id): void {
        this.classService.getSingleClass(id).subscribe((output) => {
            if (output.succes) {
                this.currentClass = output.class;
                this.classmates = output.classmates;
            }
        });
    }

    getClassNames(): void {
        for (const id of this.classIds) {
            this.classService.getSingleClass(id._id).subscribe((output) => {
                if (output.succes) {
                    this.names.push({title: output.class.title, id: id._id});
                }
                if (this.names.length == this.classIds.length) {
                    this.loading = false
                }
            });
        }
    }

    switchClass(id): void {
        this.getClass(id);
    }

    createClass() {
        if (this.userDetails.role == 'teacher') {
            let classes = new Class();
            classes.code  = Math.floor(100000 + Math.random() * 900000);;
            classes.level = this.classForm.get('classLevel').value;
            classes.title = this.classForm.get('classTitle').value;
            classes.year  = this.classForm.get('classYear').value;
            this.openform = false;

            this.classService.createClass(classes, this.userDetails).subscribe((code: Number) => {
                this.classService.joinClass(code).subscribe((output) => {
                    console.log(output.succes, output.message);
                });
            });
        } else {
            console.log('you are not eligible to create a class')
        }
    }

    onClickSelectKlas() {
        this.selectklas = !this.selectklas;
    }

    onClickOpenForm() {
        this.openform = true;  
    }
}
