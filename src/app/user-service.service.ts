import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions } from '@angular/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';


import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient, private httpReq: Http) { }

  public getUser(request): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(environment.findUser, {
      params: { username: request }
    });
  }

  public getAllUsers(): Observable<any> {
    return this.http.get(environment.findAllUsers);
  }

  public addUser(request): Observable<any> {
    return this.http.post(environment.addUser, request);
  }

  public updateUser(id: number, request): Observable<any> {
    return this.http.put(`http://localhost:9000/updateUser/${id}`, request);
  }

  public updateAdmin(id: number, request): Observable<any> {
    return this.http.put(`http://localhost:9000/updateAdmin/${id}`, request);
  }

  public registerUser(request): Observable<any> {
    return this.http.post(environment.registerUser, request);
  }

  public getUserName(request): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(environment.getUserName, {
      params: { username: request }
    });
  }

  public getPassword(request): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(environment.getPassword, request, { headers: headers });
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(`http://localhost:9000/delete/${id}`);
  }

  public deleteUser(username: string): Observable<any> {
    return this.http.delete(`http://localhost:9000/deleteLoginUser/${username}`);
  }

  logout() {
    return this.http.get(environment.logout, { responseType: 'text' })
  }
}
