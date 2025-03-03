import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { saveForLaterProduct } from './state/save-for-later.state';
import { deleteItemFromSaveForLaterStart, getUserSaveForLaterStart, moveToCartFromSaveForLaterStart } from './state/save-for-later.actions';
import { selectAllSaveForLaterItems } from './state/save-for-later.selectors';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

@Component({
    selector: 'app-save-for-later',
    imports: [CommonModule, MatButtonModule, MatTableModule, AsyncPipe, MatIconModule, EmptyStateComponent],
    templateUrl: './save-for-later.component.html',
    styleUrls: ['./save-for-later.component.scss'],
})
export class SaveForLaterComponent implements OnInit {
   displayedColumns: string[] = ['images', 'name', 'description', 'price', 'actions'];
    SaveForLaterList$: Observable<saveForLaterProduct[]> = of([]);
    store = inject(Store);
    ngOnInit(): void {
        this.store.dispatch(getUserSaveForLaterStart());
        this.SaveForLaterList$ = this.store.select(selectAllSaveForLaterItems);
    }

    deleteFromSaveForLate(element:saveForLaterProduct){
          this.store.dispatch(deleteItemFromSaveForLaterStart({productId:element.productId}))
    }

    moveToCartFromSaveForLater(element:saveForLaterProduct){
        this.store.dispatch(moveToCartFromSaveForLaterStart({productId:element.productId}))
    }
}
