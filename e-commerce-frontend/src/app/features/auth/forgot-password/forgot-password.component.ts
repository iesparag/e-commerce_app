import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
    ForgotEmailSendStart,
    resetPasswordStart,
    verifyTokenStart,
} from '../state/auth.actions';
import { Observable } from 'rxjs';
import { selectIsValidForPasswordReset } from '../state/auth.selectors';

@Component({
    selector: 'app-forgot-password',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    store = inject(Store);
    emailForm: FormGroup;
    otpForm: FormGroup;
    isEmailSubmitted = false;
    otpSent = false;
    errorMessage = '';
    otpErrorMessage = '';
    isValidForResetPassword = this.store.select(selectIsValidForPasswordReset);
    token: null | string = null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.emailForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });

        this.otpForm = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: [
                '',
                [Validators.required, Validators.minLength(6)],
            ],
        });

        this.route.queryParams.subscribe((params) => {
            console.log('params: ', params);
            this.token = params['token'];
            if (this.token) {
                // Dispatch action to verify token
                this.store.dispatch(verifyTokenStart({ token: this.token }));
            }
        });
        console.log(this.isEmailSubmitted, 'this.isEmailSubmitted');
    }

    ngOnInit(): void {
        this.isValidForResetPassword.subscribe((isValidForResetPassword) => {
            if (isValidForResetPassword) {
                this.isEmailSubmitted = true;
            } else {
                this.isEmailSubmitted = false;
            }
        });
    }

    onEmailSubmit() {
        if (this.emailForm.invalid) return;
        const email = this.emailForm.get('email')?.value;
        this.errorMessage = '';
        this.store.dispatch(ForgotEmailSendStart({ email }));
    }

    onPasswordSubmit() {
        if (this.otpForm.invalid) return;

        const newPassword = this.otpForm.get('newPassword')?.value;
        const confirmPassword = this.otpForm.get('confirmPassword')?.value;

        if (newPassword !== confirmPassword) {
            this.errorMessage = 'Passwords do not match.';
            return;
        }

        if (this.token) {
            this.store.dispatch(
                resetPasswordStart({ token: this.token, newPassword })
            );
        }
    }

    moveFocus(event: any, nextElementId: string, prevElementId: string) {
        const currentValue = event.target.value;

        // Move focus forward if value is entered and the current input is valid
        if (currentValue.length === 1) {
            const nextElement = document.getElementById(
                nextElementId
            ) as HTMLInputElement;
            if (nextElement) {
                nextElement.focus();
            }
        }
        // Move focus backward if backspace is pressed and current field is empty
        else if (event.key === 'Backspace' && currentValue.length === 0) {
            const prevElement = document.getElementById(
                prevElementId
            ) as HTMLInputElement;
            if (prevElement) {
                prevElement.focus();
            }
        }
    }

    onResendOtp() {
        // Logic to resend OTP
        this.otpErrorMessage = '';
        this.errorMessage = 'OTP has been resent!';
        // this.otpForm.reset();
        // Simulate OTP resend
    }

    onResetEmail() {
        this.isEmailSubmitted = false;
        this.otpSent = false;
        this.emailForm.reset();
        this.errorMessage = '';
        this.otpErrorMessage = '';
    }
}
