import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { OrdersService } from '../../core/services/orders.service';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-order-detail',
    imports: [CurrencyPipe, UpperCasePipe,CommonModule],
    templateUrl: './order-detail.component.html',
    styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    orderService = inject(OrdersService);
    orderDetailId: string | null = null;
    orderDetailData: any = null;

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(
                switchMap((params) => {
                    console.log('params:', params);
                    this.orderDetailId = params['id'];
                    if (this.orderDetailId) {
                        console.log('Order ID:', this.orderDetailId);
                        // API call with the orderDetailId
                        return this.orderService.getOrderDetail(
                            this.orderDetailId
                        );
                    }
                    return [];
                })
            )
            .subscribe((orderData) => {
                this.orderDetailData = orderData.data;
                console.log('Order Details:', this.orderDetailData);
            });
    }

    viewInvoice() {
        if (this.orderDetailData?.invoiceUrl) {
            window.open(this.orderDetailData.invoiceUrl, '_blank');
        } else {
            alert('Invoice not available');
        }
    }
}
