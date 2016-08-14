import {Component, OnInit} from '@angular/core';
import {UsersService} from './user.service';
import {SpinnerComponent} from '../resources/spinner.component';
import {HTTP_PROVIDERS} from '@angular/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';

@Component({
    selector: 'user',
    template: `
    <h1>User</h1>
    <button class="btn btn-primary" [routerLink]="['New']">Add User</button>
    <hr>
    <spinner [visible]="usersLoading"></spinner>
    <table class="table table-bordered">
    <thead>
        <tr>
            <td>Name</td>
            <td>Email</td>
            <td>Edit</td>
            <td>Delete</td>
        </tr>
    </thead>
    <tbody>
        <tr *ngFor="let user of users">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td class="text-center"><a [routerLink]="['EditUser', { id: user.id }]"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></td>
            <td class="text-center"><a (click)="deleteUser(user)"><i class="fa fa-trash" aria-hidden="true"></i></a></td>
        </tr>
    </tbody>
    </table>
    `,
    providers: [UsersService, HTTP_PROVIDERS],
    directives: [ROUTER_DIRECTIVES, SpinnerComponent]
})

export class UserComponent implements OnInit {
    users: any[];
    usersLoading = true;

    constructor(private _userService: UsersService) { }

    ngOnInit() {
        Observable.forkJoin(
            this._userService.getUsers()
        ).subscribe(
            posts => {
                this.users = posts[0];
            },
            null,
            () => { this.usersLoading = false; });
    }

    deleteUser(user){
		if (confirm("Are you sure you want to delete " + user.name + "?")) {
			var index = this.users.indexOf(user)
			// Here, with the splice method, we remove 1 object
            // at the given index.
            this.users.splice(index, 1);

			this._userService.deleteUser(user.id)
				.subscribe(null, 
					err => {
						alert("Could not delete the user.");
                        // Revert the view back to its original state
                        // by putting the user object at the index
                        // it used to be.
						this.users.splice(index, 0, user);
					});
		}
	}
}