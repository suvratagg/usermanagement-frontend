// imports from angular
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

// import the service
import { UserServiceService } from '../user-service.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // global variables required in the file
  showLogin: boolean = false;
  showRegister: boolean = false;
  registerForm: FormGroup;
  loginForm: FormGroup;
  adminData: any;

  //constructor declaring our service, forbuilder and router
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

  // login button 
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

  // open register new user form
  createUser() {
    this.showLogin = false;
    this.showRegister = true;
  }

  // save new user account details
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
          });
          this.userService.addUser(request).subscribe(data=>{
              delete request.password;
              delete request.firstName;
              delete request.lastName;
              delete request.userType;
              this.router.navigate(['/registernewuser', request]);
          })
        }
      });
    }
  }

  // browse back to login form
  backToLogin() {
    this.showRegister = false;
    this.showLogin = true;
  }
}
