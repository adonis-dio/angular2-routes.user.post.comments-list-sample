import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {HTTP_PROVIDERS} from '@angular/http';
import {Observable} from "rxjs/Observable";

import {UsersService} from '../user/user.service';
import {postsService} from './post.service';
import {SpinnerComponent} from '../resources/spinner.component';
import {PaginationComponent} from '../resources/pagination.component';

import 'rxjs/add/observable/forkJoin';


@Component({
    selector: 'post',
    template: `
    <h1>Post</h1>
    <div class="row">
        <div class="col-md-6">
        <select #u (change)="filterName({ userId: u.value })" class="form-control">
            <option value="">Select</option>
            <option *ngFor="let user of users" value="{{ user.id }}">{{ user.name }}</option>
        </select>
            <pagination [items]="posts" (page-changed)="onPageChanged($event)"></pagination>
            <ul class="list-group">
            <spinner [visible]="postLoading"></spinner>
                <li class="list-group-item mouse" [class.active]="currentPost == post" (click)="select(post)" *ngFor="let post of pagedPosts">{{ post.title }}</li>
            </ul>
        </div>
        <div class="col-md-6">
            <div *ngIf="currentPost" class="panel panel-default">
                <div class="panel-heading">{{ currentPost.title }}</div>
                <div class="panel-body">
                {{ currentPost.body }}
                <hr>
                <spinner [visible]="commentsLoading"></spinner>
                <div *ngFor="let comment of currentPost.comments" class="media">
                    <div class="media-left">
                        <a href="#"><img class="media-object" src="http://lorempixel.com/80/80/people?random={{ comment.id }}" alt="..."></a>
                    </div>
                    <div class="media-body">
                        <h4 class="media-heading">{{ comment.name }}</h4>
                        {{ comment.body }}asd
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [".mouse { cursor: pointer; }"],
    providers: [postsService, UsersService, HTTP_PROVIDERS],
    directives: [ROUTER_DIRECTIVES, SpinnerComponent, PaginationComponent]
})

export class PostComponent implements OnInit {
    users: any[];
    posts = [];
    pagedPosts = [];
    postLoading = true;
    usersLoading = true;
    currentPost;
    commentsLoading;
    pageSize = 10;

    constructor(private _postservice: postsService, private _userService: UsersService) { }


    ngOnInit() {
        this.loadUsers();
        this.loadPosts();
    }

    private loadUsers() {
        this._userService.getUsers()
            .subscribe(users => this.users = users);
    }

    private loadPosts(filter?) {
        this.postLoading = true;
        this._postservice.getPosts(filter).subscribe(posts => {this.posts = posts;this.pagedPosts = this.getPostsInPage(1);},null,() => { this.postLoading = false; });
    }

    select(post) {
        this.currentPost = post;
        this.commentsLoading = true;

        this._postservice.getComment(post.id)
            .subscribe(comments => {
                this.currentPost.comments = comments
            },
            null,
            () => { this.commentsLoading = false; });
    }

    filterName(filter) {
        this.currentPost = null;

        this.loadPosts(filter);
    }


    onPageChanged(page) {
        this.pagedPosts = this.getPostsInPage(page);
    }

    private getPostsInPage(page) {
        var result = [];
        var startingIndex = (page - 1) * this.pageSize;
        var endIndex = Math.min(startingIndex + this.pageSize, this.posts.length);

        for (var i = startingIndex; i < endIndex; i++)
            result.push(this.posts[i]);

        return result;
    }
}