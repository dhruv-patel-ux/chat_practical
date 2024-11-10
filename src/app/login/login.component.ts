import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../common/api-service/api-service.service';
import { SnackbarService } from '../common/models/snekbar.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatIconModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    public location: Location,
    private router: Router,
    private apiService: ApiService,
    private snackBarService: SnackbarService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  loginForm!: FormGroup

  get form() {
    return this.loginForm.controls;
  }

  login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return
    }
    this.apiService.login(this.loginForm.value).subscribe(
      (res: any) => {
        if (res.success) {
          localStorage.setItem('ACCESS_TOKEN', res.accessToken)
          localStorage.setItem('USER', JSON.stringify(res.data))
          localStorage.setItem('profile-image', res.data.avatar ? `http://localhost:9999/${res.data.avatar}` : 'src/assets/avatars/pngwing.com.png')
          this.apiService.profile_photo.set(res.data.avatar ? `http://localhost:9999/${res.data.avatar}` : 'src/assets/avatars/pngwing.com.png')
          this.snackBarService.openSuccessSnackBar(res.message);
          this.router.navigate(['/']);
        } else {
          this.snackBarService.openErrorSnackBar(res.message)
        }

      },
      (error: any) => {
        this.snackBarService.openSuccessSnackBar(error.message);
      }
    )

  }
  forgotPassword() {

  }
}
