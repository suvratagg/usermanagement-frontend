// imports from angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions } from '@angular/http';

// rxjs imports
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

// import environment details
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class UserServiceService {

  // constructor declaring http cient and http request
  constructor(private http: HttpClient, private httpReq: Http) { }

  // get single user details
  public getUser(request): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(environment.findUser, {
      params: { username: request }
    });
  }

  // get all user details
  public getAllUsers(): Observable<any> {
    return this.http.get(environment.findAllUsers);
  }

  // add a new user
  public addUser(request): Observable<any> {
    return this.http.post(environment.addUser, request);
  }

  // update an existing user by an user
  public updateUser(id: number, request): Observable<any> {
    return this.http.put(`http://localhost:9000/updateUser/${id}`, request);
  }

  // update an existing user by an admin
  public updateAdmin(id: number, request): Observable<any> {
    return this.http.put(`http://localhost:9000/updateAdmin/${id}`, request);
  }

  // update an registered user
  public update(id: number, request): Observable<any> {
    return this.http.put(`http://localhost:9000/update/${id}`, request);
  }

  // register a new user
  public registerUser(request): Observable<any> {
    return this.http.post(environment.registerUser, request);
  }

  // validate if the username is correct
  public getUserName(request): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(environment.getUserName, {
      params: { username: request }
    });
  }

  // validate if the password is correct
  public getPassword(request): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.getPassword, request, { headers: headers });
  }

  // delete a record by user id
  public delete(id: number): Observable<any> {
    return this.http.delete(`http://localhost:9000/delete/${id}`);
  }

  // delete a record by username
  public deleteUser(username: string): Observable<any> {
    return this.http.delete(`http://localhost:9000/deleteLoginUser/${username}`);
  }

  // logout
  logout() {
    return this.http.get(environment.logout, { responseType: 'text' })
  }
}
