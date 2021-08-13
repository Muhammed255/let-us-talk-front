import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { emailValidator, matchingPasswords, matchValues } from 'src/app/utils/app-validators';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  signupForm: FormGroup;

  hide = true;
  hideCon = true;

  constructor(public authService: AuthService, public fb: FormBuilder) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });


      this.initForm();
  }

  initForm() {
    this.signupForm = this.fb.group({
      'firstName': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      'lastName': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': [null, Validators.compose([Validators.required, emailValidator])],
      'type': [null, Validators.compose([Validators.required])],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    },{validator: matchingPasswords('password', 'confirmPassword')});
  }

  onSignup() {
    if (this.signupForm.invalid) {
      this.isLoading = true;
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      this.signupForm.value.firstName,
      this.signupForm.value.lastName,
      this.signupForm.value.type,
      this.signupForm.value.email,
      this.signupForm.value.password
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.isLoading = false;
  }
}
