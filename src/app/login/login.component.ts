import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

import { UserServiceService } from '../user-service.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showLogin: boolean = false;
  showRegister: boolean = false;
  registerForm: FormGroup;
  loginForm: FormGroup;

  constructor(private userService: UserServiceService, private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    window.location.hash = "no-back-button";
    window.location.hash = "Again-No-back-button";
    window.onhashchange = function () { window.location.hash = "no-back-button" };

    this.registerForm = this.formBuilder.group({
      username: new FormControl(),
      password: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      userType: new FormControl()
    });

    this.loginForm = this.formBuilder.group({
      username: new FormControl(),
      password: new FormControl()
    });

    this.showLogin = true;
  }
  adminData: any;
  login() {
    const request = this.loginForm.get('username').value;
    if ((request === null) || (request === '')) {
      swal({
        type: 'error',
        title: 'Please Enter Details To Continue'
      })
    } else {
      this.userService.getUserName(request).subscribe(data => {
        if (data) {
          const req = this.loginForm.get('password').value;
          this.userService.getPassword(req).subscribe(data => {
            if (data) {
              if (data.userType === "Admin") {
                delete data.password;
                delete data.firstName;
                delete data.lastName;
                delete data.userType;
                this.router.navigate(['/admin', data]);
                localStorage.setItem('logIn', data.username);
              } else {
                delete data.password;
                delete data.firstName;
                delete data.lastName;
                delete data.userType;
                this.router.navigate(['/user', data]);
                localStorage.setItem('logIn', data.username);
              }
            } else {
              swal({
                type: 'error',
                title: 'Incorrect Password'
              })
            }
          });
        } else {
          swal({
            type: 'error',
            title: 'User Does Not Exist'
          })
        }
      })
    }
  }

  createUser() {
    this.showLogin = false;
    this.showRegister = true;
  }

  saveUser() {
    const request = this.registerForm.getRawValue();
    if ((request.firstName === null) || (request.firstName === '') || (request.lastName === null) ||
      (request.lastName === '') || (request.username === null) || (request.username === '') || (request.password === null)
      || (request.password === '') || (request.userType === null)) {
      swal({
        type: 'error',
        title: 'Please Enter All The Details'
      })
    } else {
      const uname = request.username;
      this.userService.getUserName(uname).subscribe(data => {
        if (data) {
          swal({
            type: 'error',
            title: 'Username Already Exists'
          })
        } else {
          this.userService.registerUser(request).subscribe(data => {
            if (request.userType === "Admin") {
              this.router.navigate(['/admin', request]);
            } else {
              this.router.navigate(['/user', request]);
            }
          });
        }
      });
    }
  }

  backToLogin(){
    this.showRegister = false;
    this.showLogin = true;
  }
}