import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/_core/auth/auth.service';
import { TokenService } from 'src/_core/auth/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private auth: AuthService,
    private router: Router,
    private token: TokenService
  ) { }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(20)],
    ],
  });

  loginFormButton() {
    if (!this.loginForm.valid) {
      this.toast.error('Please fill the Form');
      console.log('Please fill the Form');
    }

    const email: string = this.loginForm.value.email!;
    const password: string = this.loginForm.value.password!;
    if (email === 'admin@gmail.com' && password === 'admin123') {
      this.auth.login(this.loginForm.value).subscribe(
        (res: any) => {
          if (res.response === true) {
            this.token.setToken(res.data.token);
            this.router.navigateByUrl('/admin/auth/dashboard');
          }else{
            this.toast.error("Internal Server Error")
          }
        },(err:any) => {
          const errorMessage = err.error || err.error.error || err.statusText || err.error.details || err.status || "An unknown error occurred. Please try again.";
          this.toast.error(errorMessage);
        }
      );
    } else {
      this.auth.login(this.loginForm.value).subscribe(
        (res: any) => {
          if (res.response === true) {
            this.token.setToken(res.data.token);
            this.router.navigateByUrl('/user/auth/Dashboard');
          }
        }
      );
    }
  }
}

