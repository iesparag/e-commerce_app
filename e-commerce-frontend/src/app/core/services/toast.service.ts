import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root' // Service ko global bana raha hai
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  // Success Toast
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'left',
      // panelClass: ['toast-success'] 
    });
  }

  // Error Toast
  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      // panelClass: ['toast-error'] 
    });
  }

  // Info Toast (Optional)
  showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      // panelClass: ['toast-info'] 
    });
  }
}
