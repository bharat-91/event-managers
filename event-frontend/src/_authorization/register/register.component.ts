import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators, ValidationErrors, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/_core/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private fb: FormBuilder, private toast: ToastrService, private auth: AuthService) { }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    contactNumber: ['', [Validators.required, Validators.pattern("[0-9]{10}")]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    confirmPassword: ['', Validators.required]
  }, {
    validator: this.passwordMatchValidator.bind(this) // Ensure 'this' context is correct
  });

  registerFormButton() {
    if (!this.registerForm.valid) {
      this.toast.error("Please fill the form correctly.");
      console.log("Please fill the form correctly.");
      return;
    }


    this.auth.signUp(this.registerForm.value).subscribe((res: any) => {
      if (res.response) {
        console.log("Success");
        this.toast.success("Registration successful");
        console.log(this.registerForm.value);
      } else {
        console.log("Registeration Failed");
      }
    }, (err: any) => {
      const errorMessage = err.error.message || err.error || err.statusText || err.error.details || err.status || "An unknown error occurred. Please try again.";
      this.toast.error(errorMessage || 'Data');
    })
  }
}
