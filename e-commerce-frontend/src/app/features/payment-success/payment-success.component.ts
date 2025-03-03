import { CommonModule } from '@angular/common';
import {  Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  sessionId: string | null = null;

  ngOnInit() {
    // this.router.navigate(['/payment/success']);
    console.log(0);
    this.activatedRoute.queryParamMap.subscribe(params => {
      console.log('params: ', params);
      this.sessionId = params.get('session_id');
      console.log('Session ID:', this.sessionId);
    });
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  viewOrderDetails() {
    if (this.sessionId) {
      this.router.navigate([`/orders/${this.sessionId}`]);
    } else {
      alert('Order ID not found');
    }
  }
}
