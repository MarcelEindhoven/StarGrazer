import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Injectable } from "@angular/core"
import { UserService, IUser } from './user.service';
import { Observable, throwError } from 'rxjs';

// Create an interface that matches the HTTP return data
@Injectable()
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    public user: IUser;
    public id: string;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
      this.user.id = this.route.snapshot.paramMap.get('id');
      this.user.name = this.user.id;
      const subscription = this.userService.getUser(this.user.id).subscribe({
        next(user: IUser) {
          console.log('Username: ', user.name);
          this.user = user;
        },
        error(msg) {
          console.log('Error Getting User: ', msg);
        }})
          
  }

  ngOnInit(): void {
  }

}
