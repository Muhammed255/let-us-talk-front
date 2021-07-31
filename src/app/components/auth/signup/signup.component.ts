import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  signupForm: FormGroup;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });

    this.signupForm = new FormGroup({
      firstName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      lastName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      type: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required] }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }

  onSignup() {
    if (this.signupForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      this.signupForm.controls.firstName.value,
      this.signupForm.controls.lastName.value,
      this.signupForm.controls.type.value,
      this.signupForm.controls.email.value,
      this.signupForm.controls.password.value
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
