// imports from angular
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { ParamMap } from '@angular/router';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';

//import the service
import { UserServiceService } from '../user-service.service'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // global variables required in the file
  show: boolean = false;
  form: FormGroup;
  addUserForm: FormGroup;
  updateForm: FormGroup;
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

  //constructor declaring our service, forbuilder and router
  constructor(private userService: UserServiceService, private formBuilder: FormBuilder,
    private router: ActivatedRoute, private route: Router) { }

  ngOnInit() {
    this.showHeader = true;

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

    this.updateForm = this.formBuilder.group({
      firstName: new FormControl(),
      lastName: new FormControl(),
      username: new FormControl(),
      address: new FormControl(),
      age: new FormControl(),
      userType: new FormControl({ value: '', disabled: true }),
      employeeCode: new FormControl({ value: '', disabled: true }),
      employeeStatus: new FormControl({ value: '', disabled: true }),
      employeeReport: new FormControl({ value: '', disabled: true })
    });
  }

  // form group details of the form array
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

  // back to home page method
  home() {
    this.form.reset();
    this.addUser = false;
    this.show = false;
    this.updateUser = false;
    this.showHeader = true;
  }

  //search result method
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

  // search All method
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

  // open add user form
  add() {
    this.addUser = true;
    this.show = false;
    this.addUserForm.reset();
    this.showHeader = false;
  }

  // saving a new added user
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

  //open update user form
  openUpdateAdminForm(item) {
    this.updateParamUserId = item.value.userId;
    this.updateUser = true;
    this.updateAdminUser = false;
    this.showHeader = false;
    this.updateForm.patchValue(item.value);
    this.show = false;
  }

  // saving the updated details of the user
  updateUserInfo() {
    const id: number = this.updateParamUserId;
    const request = this.updateForm.getRawValue();
    this.userService.updateUser(id, request).subscribe(data => {
      this.updateUser = false;
      this.showHeader = true;
      swal(
        'Success',
        'User Updated Successfully',
        'success'
      )
    })
  }

  // logout method
  logout() {
    this.userService.logout().subscribe(data => {
      if (data === "Logout") {
        this.route.navigate(['/login']);
        localStorage.clear();
      }
    });
  }
}