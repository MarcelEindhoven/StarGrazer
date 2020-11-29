import { Component, OnInit, Input } from '@angular/core';
import { Injectable } from "@angular/core"
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// interface that matches the HTTP return data
export interface IUser {
id: string,
name: string
};

@Injectable()
export class UserService{
  urlBase: string ="https://us-central1-stargrazer.cloudfunctions.net/user/";    
  constructor(
    private http: HttpClient
  ) {
         
  }

  getUser(id: string): Observable<IUser> {
      return this.http.get<IUser>(this.urlBase + id);
  }

}
