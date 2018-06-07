import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';

import { ParamMap } from '@angular/router';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';

import { UserServiceService } from '../user-service.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  show: boolean = false;
  form: FormGroup;
  addUserForm: FormGroup;
  updateUserForm: FormGroup;
  userDetails = [];
  addUser: boolean = false;
  dataSearchAll: any;
  updateAdminUser: boolean = false;
  updateUser: boolean = false;
  singleUserData: any;
  val: any;
  showHeader: boolean = true;
  displayName: any;
  updateParamUserId: number;

  constructor(private userService: UserServiceService, private formBuilder: FormBuilder,
    private router: ActivatedRoute, private route: Router) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.val = params;
    });

    const userName = this.val.username;
    this.userService.getUserName(userName).subscribe(data => {
      this.displayName = data;
    });

    this.form = this.formBuilder.group({
      fName: new FormControl(),
      userDetails: new FormArray([])
    });

    this.addUserForm = this.formBuilder.group({
      firstName: new FormControl(),
      lastName: new FormControl(),
      username: new FormControl(),
      address: new FormControl(),
      age: new FormControl(),
      userType: new FormControl(),
      employeeCode: new FormControl(),
      employeeStatus: new FormControl(),
      employeeReport: new FormControl()
    });

    this.updateUserForm = this.formBuilder.group({
      firstName: new FormControl({ value: '', disabled: true }),
      lastName: new FormControl({ value: '', disabled: true }),
      username: new FormControl({ value: '', disabled: true }),
      address: new FormControl({ value: '', disabled: true }),
      age: new FormControl({ value: '', disabled: true }),
      userType: new FormControl({ value: '', disabled: true }),
      employeeCode: new FormControl(),
      employeeStatus: new FormControl(),
      employeeReport: new FormControl()
    });
  }

  createDetails(): FormGroup {
    return this.formBuilder.group({
      userId: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      username: new FormControl(),
      address: new FormControl(),
      age: new FormControl(),
      userType: new FormControl(),
      employeeCode: new FormControl(),
      employeeStatus: new FormControl(),
      employeeReport: new FormControl()
    })
  }

  home() {
    this.form.reset();
    this.addUser = false;
    this.show = false;
    this.updateUser = false;
    this.updateAdminUser = false;
    this.showHeader = true;
  }

  onSearch() {
    const req = this.form.get('fName').value;
    JSON.stringify(req);
    if ((req === null) || (req === '')) {
      swal({
        type: 'error',
        title: 'Please Enter Username To Search'
      })
      this.form.reset();
      this.show = false;
      this.addUser = false;
      this.updateAdminUser = false;
      this.updateUser = false;
    } else {
      this.userService.getUser(req).subscribe(data => {
        if (data[0]) {
          this.singleUserData = data;
          this.form.reset();
          this.addUser = false;
          this.show = true;
          this.updateAdminUser = false;
          this.updateUser = false;
          const control = <FormArray>this.form.controls['userDetails'];
          data.forEach(item => {
            if (item.firstName != null) {
              control.push(this.createDetails());
            }
          });
          this.form.controls['userDetails'].patchValue(data);
        }
        else {
          swal({
            type: 'error',
            title: 'No Record Found!'
          })
          this.form.reset();
          this.show = false;
          this.addUser = false;
          this.updateAdminUser = false;
          this.updateUser = false;
        }
      });
    }
    this.ngOnInit();
  }

  searchAll() {
    this.userService.getAllUsers().subscribe(data => {
      this.dataSearchAll = data;
      this.show = true;
      this.addUser = false;
      const control = <FormArray>this.form.controls['userDetails'];
      data.forEach(item => {
        if (item.firstName != null) {
          control.push(this.createDetails());
        }
      });
      this.form.controls['userDetails'].patchValue(data);
    });
    this.form.reset();
    this.ngOnInit();
  }

  add() {
    this.addUser = true;
    this.show = false;
    this.addUserForm.reset();
    this.showHeader = false;
  }

  save() {
    const request = this.addUserForm.getRawValue();
    if ((request.firstName === null) || (request.firstName === '') || (request.lastName === null) || (request.lastName === '')
      || (request.username === null) || (request.username === '') || (request.address === null) || (request.address === '') ||
      (request.age === 0) || (request.employeeCode === null) || (request.employeeCode === '') ||
      (request.employeeReport === null) || (request.employeeReport === '') || (request.employeeStatus === null) ||
      (request.employeeStatus === '') || (request.userType === null)) {
      swal({
        type: 'error',
        title: 'Please Enter All Details'
      })
    } else {
      this.userService.addUser(request).subscribe(data => {
        this.addUser = false;
        this.show = false;
        this.showHeader = true;
        swal(
          'Success',
          'User Added Successfully',
          'success'
        )
      });
    }
  }

  openUpdateAdminForm(item) {
    this.updateParamUserId = item.value.userId;
    this.updateAdminUser = true;
    this.updateUser = false;
    this.show = false;
    this.updateUserForm.patchValue(item.value);
    this.showHeader = false;
  }

  updateAdmin() {
    const id: number = this.updateParamUserId;
    const request = this.updateUserForm.getRawValue();
    this.userService.updateAdmin(id, request).subscribe(data => {
      this.updateAdminUser = false;
      this.showHeader = true;
      swal(
        'Success',
        'User Updated Successfully',
        'success'
      )
    })
  }

  logout() {
    this.userService.logout().subscribe(data => {
      if (data === "Logout") {
        this.route.navigate(['/login']);
        localStorage.clear();
      }
    });
  }

  deleteIcon(item) {
    swal({
      title: 'Delete ' + item.value.firstName + ' ' + item.value.lastName + ' ?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#18C61D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        const req = item.value.userId;
        const uname = item.value.username;
        this.userService.delete(req).subscribe(data => {
          this.addUser = false;
          this.show = false;
          this.showHeader = true;
        });
        this.userService.deleteUser(uname).subscribe(data => {
          this.addUser = false;
          this.show = false;
          this.showHeader = true;
        });
        swal(
          'User has been deleted!',
          '',
          'success'
        )
      }
    })
  }
}
