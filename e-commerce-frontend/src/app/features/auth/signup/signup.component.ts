import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signUpForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  confirmPasswordMismatch: boolean = false;  // Flag to check if passwords match
  confirmPasswordChecked: boolean = false;  // Flag to track if password is checked for match

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize the form group with validations
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      // Custom validator to check if passwords match
      validator: this.passwordMatcher
    });
  }

  authService = inject(AuthService);
  // Custom validator to match password and confirm password
  passwordMatcher(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  // Check password mismatch on confirm password field blur
  onConfirmPasswordBlur(): void {
    const password = this.signUpForm.get('password')?.value;
    const confirmPassword = this.signUpForm.get('confirmPassword')?.value;

    // If password is filled, check if confirmPassword matches
    if (confirmPassword) {
      if (password !== confirmPassword) {
        this.confirmPasswordMismatch = true;
        this.confirmPasswordChecked = true;
      } else {
        this.confirmPasswordMismatch = false;
        this.confirmPasswordChecked = true;
      }
    }
  }

  // Submit form data
  onSubmit(): void {
    if (this.signUpForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const signUpData = this.signUpForm.value;
    this.authService.signup(signUpData).subscribe(
      response => {
        this.isLoading = false;
        this.router.navigate(['/login']); 
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
