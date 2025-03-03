import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUserOrdersStart } from './state/order.actions';
import { Observable } from 'rxjs';
import { Order } from './state/order.state';
import { selectAllOrders } from './state/order.selectors';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, NgClass, UpperCasePipe } from '@angular/common'; // Import NgClass
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true, // Standalone component
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    NgClass, // Import NgClass
    CurrencyPipe, // ✅ Import CurrencyPipe
    UpperCasePipe,
  ],
})
export class OrdersComponent implements OnInit {
  store = inject(Store);
  router = inject(Router);
  orderList$: Observable<Order[]> = this.store.select(selectAllOrders);
  dataSource = new MatTableDataSource<Order>([]);
  displayedColumns: string[] = ['orderId', 'user', 'amount','items', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.store.dispatch(getUserOrdersStart());

    this.orderList$.subscribe((orders) => {
      this.dataSource.data = orders;
      this.dataSource.paginator = this.paginator;
    });
  }

  // Dummy function to fix error
  viewOrder(orderId: Order['_id']) {
    console.log('View Order:', orderId);
    this.router.navigate(['/orders/' + orderId]);
  }
}
