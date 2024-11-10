import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { ApiService } from '../common/api-service/api-service.service';
import { Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../common/models/snekbar.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatIconModule, RouterLink],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public location: Location,
    private snackBarService: SnackbarService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
      { validators: this.passwordMatchValidator }

    )
  }

  signUpForm!: FormGroup
  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
  }
  get form() {
    return this.signUpForm.controls;
  }

  submit = false;
  signUp() {
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.value.password != this.signUpForm.value.confirmPassword) {
      this.submit = true
      this.snackBarService.openErrorSnackBar("Password Not Match")
      return
    }
    this.apiService.signup(this.signUpForm.value).subscribe(
      (res: any) => {
        if (res.status) {
          localStorage.setItem('ACCESS_TOKEN', res.accessToken)
          localStorage.setItem('USER', JSON.stringify(res.data))
          localStorage.setItem('profile-image', res.avatar);
          this.apiService.profile_photo.set(res.avatar)
          this.snackBarService.openSuccessSnackBar(res.message);
          this.router.navigate(['/']);
        } else {
          this.snackBarService.openErrorSnackBar(res.message);
        }
      }, (error: any) => {
        this.snackBarService.openErrorSnackBar(error.message);
      });
  }

  passwordMatchValidator(g: FormGroup) {
    const passwordControl = g?.get('password');
    const confirmPasswordControl = g?.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      return passwordControl.value === confirmPasswordControl.value ? null : { mismatch: true };
    } else {
      return { mismatch: true };
    }
  }
}
