import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { ParamMap } from '@angular/router';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';

//import the service
import { UserServiceService } from '../user-service.service'

@Component({
  selector: 'app-register-new-user',
  templateUrl: './register-new-user.component.html',
  styleUrls: ['./register-new-user.component.css']
})
export class RegisterNewUserComponent implements OnInit {

  val: any;
  display: any;
  updateUserForm: FormGroup;

  constructor(private userService: UserServiceService, private formBuilder: FormBuilder,
    private router: ActivatedRoute, private route: Router) { }

  ngOnInit() {
    this.updateUserForm = this.formBuilder.group({
      firstName: new FormControl({ value: '', disabled: true }),
      lastName: new FormControl({ value: '', disabled: true }),
      username: new FormControl({ value: '', disabled: true }),
      address: new FormControl(),
      age: new FormControl(),
      userType: new FormControl({ value: '', disabled: true }),
      employeeCode: new FormControl(),
      employeeStatus: new FormControl(),
      employeeReport: new FormControl()
    });

    this.router.params.subscribe(params => {
      this.val = params;
    });

    const userName = this.val.username;
    this.userService.getUser(userName).subscribe(data => {
      this.display = data;
      this.updateUserForm.patchValue(this.display[0]);
    });
  }

  // saving the updated details of the user
  update() {
    const id: number = this.display[0].userId;
    const request = this.updateUserForm.getRawValue();
    this.userService.update(id, request).subscribe(data => {
      if (data.userType === 'Admin') {
        delete data.userId;
        delete data.firstName;
        delete data.lastName;
        delete data.address;
        delete data.age;
        delete data.userType;
        delete data.employeeCode;
        delete data.employeeReport;
        delete data.employeeStatus;
        delete data.email;
        this.route.navigate(['/admin', data]);
      } else {
        delete data.userId;
        delete data.firstName;
        delete data.lastName;
        delete data.address;
        delete data.age;
        delete data.userType;
        delete data.employeeCode;
        delete data.employeeReport;
        delete data.employeeStatus;
        delete data.email;
        this.route.navigate(['/user', data]);
      }
    })
  }
}
