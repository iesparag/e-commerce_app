import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports:[CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  otpForm: FormGroup;
  isEmailSubmitted = false;
  otpSent = false;
  isLoading = false;
  errorMessage = '';
  otpErrorMessage = '';
  emailVerified = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.maxLength(1)]],
      otp2: ['', [Validators.required, Validators.maxLength(1)]],
      otp3: ['', [Validators.required, Validators.maxLength(1)]],
      otp4: ['', [Validators.required, Validators.maxLength(1)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    ['otp1', 'otp2', 'otp3', 'otp4'].forEach(otpField => {
      this.otpForm.get(otpField)?.valueChanges.subscribe(() => this.checkOtpValidity());
    });
  }

  onEmailSubmit() {
    if (this.emailForm.invalid) return;

    const email = this.emailForm.get('email')?.value;
    this.isLoading = true;
    this.errorMessage = '';

    // Simulate OTP sending API call
    setTimeout(() => {
      this.isLoading = false;
      this.emailVerified = true; // Simulating successful email verification
      this.otpSent = true; // OTP has been sent
      this.isEmailSubmitted = true; // Switch to OTP form
    }, 1000);
  }

  onOtpSubmit() {
    if (this.otpForm.invalid) return;

    const otp = this.otpForm.get('otp1')?.value + this.otpForm.get('otp2')?.value + this.otpForm.get('otp3')?.value + this.otpForm.get('otp4')?.value;
    const newPassword = this.otpForm.get('newPassword')?.value;
    const confirmPassword = this.otpForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Simulate OTP verification and password reset
    setTimeout(() => {
      if (otp === '1234') { // Assume OTP is '1234'
        this.router.navigate(['/login']); // Redirect to login page after successful reset
      } else {
        this.errorMessage = 'Invalid OTP. Please try again.';
      }
    }, 1000);
  }

  moveFocus(event: any, nextElementId: string, prevElementId: string) {
    const currentValue = event.target.value;
  
    // Move focus forward if value is entered and the current input is valid
    if (currentValue.length === 1) {
      const nextElement = document.getElementById(nextElementId) as HTMLInputElement;
      if (nextElement) {
        nextElement.focus();
      }
    } 
    // Move focus backward if backspace is pressed and current field is empty
    else if (event.key === 'Backspace' && currentValue.length === 0) {
      const prevElement = document.getElementById(prevElementId) as HTMLInputElement;
      if (prevElement) {
        prevElement.focus();
      }
    }
  }
  
  
  checkOtpValidity() {
    const otpValues = [
      this.otpForm.get('otp1')?.value,
      this.otpForm.get('otp2')?.value,
      this.otpForm.get('otp3')?.value,
      this.otpForm.get('otp4')?.value
    ];
  
  
    // Avoid error message for a reset form
    if (otpValues.every(value => value === null || value === '')) {
      this.otpErrorMessage = ''; // No error for empty fields after reset
      return;
    }
  
    // Check if all OTP fields are filled
    if (otpValues.every(value => value && value.trim() !== '')) {
      this.otpErrorMessage = ''; // Clear OTP error message
    } else {
      this.otpErrorMessage = 'OTP is required and should be 4 digits.';
    }
  }
  
  

  onResendOtp() {
    // Logic to resend OTP
    this.otpErrorMessage = ''; 
    this.errorMessage = 'OTP has been resent!';
    this.otpForm.reset();
    // Simulate OTP resend
    
   
  }

  onResetEmail() {
    this.isEmailSubmitted = false;
    this.otpSent = false;
    this.emailForm.reset();
    this.errorMessage = ""
    this.otpErrorMessage = ''; 
    this.otpForm.reset(); // Reset OTP form as well
    
  }
}
