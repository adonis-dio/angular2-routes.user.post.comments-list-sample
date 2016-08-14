import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {NavbarComponent} from './navbar.component';
import {HomeComponent} from './home.component';
import {UserComponent} from './user/user.component';
import {PostComponent} from './post/post.component';
import {NotFoundComponent} from './not-found.component';
import {NewUserComponent} from './user/form-user.component';

@RouteConfig([
    { path: '/', name: 'Home', component: HomeComponent, useAsDefault: true },
    { path: '/user', name: 'User', component: UserComponent },
    { path: '/user/:id', name: 'EditUser', component: NewUserComponent },
    { path: '/user/new', name: 'New', component: NewUserComponent },
    { path: '/post', name: 'Post', component: PostComponent },
    { path: '/*other', name: 'Other', redirectTo: ['Home'] },
    { path: '/not-found', name: 'NotFound', component: NotFoundComponent }
])

@Component({
    selector: 'my-app',
    template: `
    <navbar></navbar>
    <div class="container-fluid">
        <router-outlet></router-outlet>
    </div>
    `,
    directives: [NavbarComponent, ROUTER_DIRECTIVES]
})

export class AppComponent {
}