import {Component, OnInit} from '@angular/core';
import {ControlGroup, FormBuilder, Validators} from '@angular/common';
import {Router, CanDeactivate, RouteParams} from '@angular/router-deprecated';
import {HTTP_PROVIDERS} from '@angular/http';

import {UsersService} from './user.service';
import {SignupValidators} from '../resources/signup.validators';
import {User} from './user';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';


@Component({
    selector: 'new',
    templateUrl: "./app/html/new-user.component.html",
    providers: [UsersService, HTTP_PROVIDERS]
})

export class NewUserComponent implements OnInit {
    signupForm: ControlGroup;
    title: string;
    user = new User();

    ngOnInit() {
        var id = this._routeParams.get("id");

        //decides the title of the form
        this.title = id ? "Edit User" : "New User";

        //if id exist does nothing, else get the user data with the given id.
        if (!id)
            return;

        this._userService.getUser(id)
            .subscribe(
            user => this.user = user,
            response => {
                if (response.status == 404) {
                    this._router.navigate(['NotFound']);
                }
            });
    }

    constructor(fb: FormBuilder, private _routeParams: RouteParams, private _router: Router, private _userService: UsersService) {
        this.signupForm = fb.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(3)]), SignupValidators.shouldBeUnique],
            email: ['', Validators.compose([Validators.required, SignupValidators.emailFormat])],
            phone: ['', Validators.required],
            address: fb.group({
                street: ['', Validators.required],
                suite: ['', Validators.required],
                city: ['', Validators.required],
                zipcode: ['', Validators.required]
            })
        });
    }

    routerCanDeactivate(next, previous) {
        if (this.signupForm.dirty) {
            return confirm("You seems to have started filling the form, are you sure you wanna leave?");
        }
    }

    save() {
        var result;
        if (this.user.id)
            result = this._userService.updateUser(this.user);
        else
            result = this._userService.addUser(this.user);

        result.subscribe(x => {
            //this.signupForm.markAsPristine();
            this._router.navigate(['User']);
        });
    }


}